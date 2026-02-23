import { html, render, TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { classMap } from "lit/directives/class-map.js";
import bookModel, { BookModelEvent } from "@/model";

/**
 * [아키텍처 설명]
 * Lit의 ReactiveController 패턴을 바닐라 JS 환경에 맞게 경량화하여 구현했습니다.
 * 이 인터페이스를 통해 UI 컴포넌트(Host)와 비즈니스 로직(Controller)을 완벽하게 분리합니다.
 */
interface ReactiveController {
    hostConnected(): void;
    hostDisconnected(): void;
}

interface ReactiveControllerHost extends HTMLElement {
    addController(controller: ReactiveController): void;
    requestUpdate(): void;
}

/**
 * FavoriteNav Component (God Tier Version)
 *
 * [핵심 기술적 특징]
 * 1. **Reactive Controller**: 상태 관리 로직을 별도 클래스로 분리하여 재사용성과 유지보수성 극대화.
 * 2. **AbortController**: 이벤트 리스너 제거를 자동화하여 메모리 누수 원천 차단.
 * 3. **Microtask Batching**: `await 0`을 사용하여 불필요한 중복 렌더링 방지 (성능 최적화).
 * 4. **Private Fields (#)**: 자바스크립트 표준 Private 필드로 완벽한 캡슐화 보장.
 * 5. **Roving Tabindex**: 화살표 키, Home/End 키를 지원하는 완벽한 키보드 접근성(A11y).
 */
export default class FavoriteNav
    extends HTMLElement
    implements ReactiveControllerHost
{
    static get observedAttributes() {
        return ["selected-category"];
    }

    // 진정한 Private Fields (외부 접근 불가)
    #controllers = new Set<ReactiveController>();
    #isUpdatePending = false;
    #abortController = new AbortController();
    #navController: FavoriteNavController;

    constructor() {
        super();
        // 컨트롤러 인스턴스화 (로직 위임)
        this.#navController = new FavoriteNavController(this);
    }

    // 컨트롤러 등록 메서드
    public addController(controller: ReactiveController): void {
        this.#controllers.add(controller);
        if (this.isConnected) controller.hostConnected();
    }

    public removeController(controller: ReactiveController): void {
        this.#controllers.delete(controller);
    }

    connectedCallback() {
        // 새로운 생명주기 시작 시 AbortController 초기화
        this.#abortController = new AbortController();
        const { signal } = this.#abortController;

        // [이벤트 최적화] signal 옵션을 사용하여 제거 로직을 자동화
        this.addEventListener("keydown", this.#handleKeydown, { signal });
        this.addEventListener("click", this.#handleClick, { signal });

        this.#controllers.forEach((c) => c.hostConnected());
        this.dispatchEvent(new CustomEvent("connected"));
        this.requestUpdate();
    }

    disconnectedCallback() {
        // [메모리 누수 방지] 단 한 번의 호출로 연결된 모든 리스너 제거
        this.#abortController.abort();
        this.#controllers.forEach((c) => c.hostDisconnected());
        this.dispatchEvent(new CustomEvent("disconnected"));
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "selected-category" && oldValue !== newValue) {
            this.requestUpdate();
        }
    }

    /**
     * [렌더링 최적화]
     * 마이크로태스크 큐를 활용한 비동기 배칭 시스템.
     * 상태가 여러 번 변경되더라도 브라우저 페인팅 전에 딱 한 번만 렌더링합니다.
     */
    public async requestUpdate() {
        if (this.#isUpdatePending) return;
        this.#isUpdatePending = true;

        try {
            await 0; // 현재 실행 스택이 끝날 때까지 대기 (Microtask)
            this.#performUpdate();
        } catch (error) {
            console.error("FavoriteNav Update Error:", error);
        } finally {
            this.#isUpdatePending = false;
        }
    }

    #performUpdate() {
        // 내부 상태와 DOM 속성 동기화
        const activeCategory = this.#navController.activeCategory;
        if (
            activeCategory &&
            this.getAttribute("selected-category") !== activeCategory
        ) {
            this.setAttribute("selected-category", activeCategory);
        }

        this.#render();
    }

    #render() {
        const categories = this.#navController.categories;
        const selected = this.#navController.activeCategory;
        const hasCategories = categories.length > 0;

        this.toggleAttribute("hidden", !hasCategories);
        if (!hasCategories) return;

        // lit-html은 변경된 부분만 효율적으로 DOM에 반영합니다.
        render(this.#template(categories, selected), this);
    }

    #template(categories: readonly string[], selected: string | null) {
        return html`
            <nav
                class="favorite-category"
                role="tablist"
                aria-label="도서 카테고리"
            >
                ${repeat(
                    categories,
                    (cat) => cat, // 리스트 렌더링 최적화를 위한 Key 설정
                    (cat) => this.#renderTab(cat, selected),
                )}
            </nav>
            <button
                type="button"
                class="favorite-changeButton"
                aria-label="카테고리 편집"
                data-action="edit"
            >
                편집
            </button>
        `;
    }

    #renderTab(cat: string, active: string | null): TemplateResult {
        const isActive = cat === active;
        return html`
            <a
                href="?category=${encodeURIComponent(cat)}"
                class="${classMap({ "category-item": true, active: isActive })}"
                aria-selected="${isActive}"
                role="tab"
                tabindex="${isActive ? "0" : "-1"}"
                data-category="${cat}"
            >
                ${cat}
            </a>
        `;
    }

    // --- 사용자 인터랙션 핸들러 ---

    #handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const actionBtn = target.closest(
            '[data-action="edit"]',
        ) as HTMLElement | null;

        if (actionBtn) {
            e.preventDefault();
            this.#dispatchEditEvent();
            return;
        }
    };

    /**
     * [웹 접근성 - Roving Tabindex]
     * 방향키로 탭 사이를 이동하고, Home/End 키를 지원합니다.
     */
    #handleKeydown = (e: KeyboardEvent) => {
        const tabs = Array.from(
            this.querySelectorAll('[role="tab"]'),
        ) as HTMLElement[];
        if (tabs.length === 0) return;

        const currentIndex = tabs.indexOf(
            document.activeElement as HTMLElement,
        );
        if (currentIndex === -1) return;

        let nextIndex: number | null = null;

        switch (e.key) {
            case "ArrowRight":
                nextIndex = (currentIndex + 1) % tabs.length;
                break;
            case "ArrowLeft":
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                break;
            case "Home":
                nextIndex = 0;
                break;
            case "End":
                nextIndex = tabs.length - 1;
                break;
        }

        if (nextIndex !== null) {
            e.preventDefault();
            this.#activateTab(tabs[nextIndex]);
        }
    };

    #activateTab(tab: HTMLElement) {
        tab.focus();
        tab.click();
    }

    #dispatchEditEvent() {
        this.dispatchEvent(
            new CustomEvent("edit-categories", {
                bubbles: true,
                composed: true,
                detail: { source: "FavoriteNav" },
            }),
        );

        // 레거시 로직 호환성 유지 (필요하다면 추후 이벤트 기반으로 완전 분리 권장)
        const overlay = document.querySelector("overlay-category") as HTMLElement;
        if (overlay) overlay.hidden = !overlay.hidden;
    }
}

/**
 * [FavoriteNavController]
 * 뷰(View)와 모델(Model)을 연결하는 접착제 역할을 합니다.
 * 컴포넌트의 생명주기에 맞춰 데이터 구독 및 해제를 자동으로 관리합니다.
 */
class FavoriteNavController implements ReactiveController {
    #host: ReactiveControllerHost;
    #cleanupFns: Set<() => void> = new Set();

    constructor(host: ReactiveControllerHost) {
        this.#host = host;
        host.addController(this);
    }

    hostConnected() {
        const update = () => this.#host.requestUpdate();

        // Model 구독
        bookModel.subscribe(BookModelEvent.FavoriteCategoriesUpdate, update);
        bookModel.subscribe(BookModelEvent.BookStateUpdate, update);
        window.addEventListener("popstate", update);

        // 구독 해제 로직 저장 (클로저 활용)
        this.#cleanupFns.add(() => {
            bookModel.unsubscribe(
                BookModelEvent.FavoriteCategoriesUpdate,
                update,
            );
            bookModel.unsubscribe(BookModelEvent.BookStateUpdate, update);
            window.removeEventListener("popstate", update);
        });
    }

    hostDisconnected() {
        // 저장된 모든 정리 함수 실행
        this.#cleanupFns.forEach((fn) => fn());
        this.#cleanupFns.clear();
    }

    // 읽기 전용 접근자 (데이터 불변성 유지 노력)
    get categories(): readonly string[] {
        return bookModel.favoriteCategoryOrder;
    }

    get activeCategory(): string | null {
        return (
            this.#host.getAttribute("selected-category") ||
            new URLSearchParams(location.search).get("category") ||
            bookModel.favoriteCategoryOrder[0] ||
            null
        );
    }
}
