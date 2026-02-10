import BookItem from "./BookItem";
import { Observer } from "../../utils/index";
import store, { AppState } from "../../model/Store";
import LoadingComponent from "../../components/LoadingComponent";

export default class SearchResult extends HTMLElement {
    private listContainer: HTMLElement;
    private paginationElement: HTMLElement;
    private observeTarget: HTMLElement;
    private loadingComponent: LoadingComponent | null;
    private observer?: Observer;
    
    private boundHandleStateChange: (state: AppState | undefined) => void;

    constructor() {
        super();
        this.listContainer = this.querySelector("[data-list-container]") as HTMLElement;
        this.paginationElement = this.querySelector(".paging-info") as HTMLElement;
        this.observeTarget = this.querySelector(".observe") as HTMLElement;
        this.loadingComponent = this.querySelector<LoadingComponent>("loading-component");

        this.boundHandleStateChange = this.handleStateChange.bind(this);
    }

    connectedCallback() {
        store.subscribe(this.boundHandleStateChange);
        this.observer = new Observer(this.observeTarget, () => store.loadMoreBooks());
        
        // 초기 상태로 렌더링
        this.handleStateChange(store.getState());
    }

    disconnectedCallback() {
        store.unsubscribe(this.boundHandleStateChange);
        this.observer?.disconnect();
    }

    private handleStateChange(state: AppState | undefined) {
        if (!state) return;
        this.render(state);
    }
    
    private render(state: AppState) {
        const { searchResults, total, currentItemCount, apiStatus, searchKeyword, prevSearchKeyword } = state;
        
        const clearListContainer = (element: HTMLElement) => {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        };

        // 새로운 검색어인 경우, 목록을 완전히 초기화
        if (searchKeyword !== prevSearchKeyword) {
            clearListContainer(this.listContainer);
            this.paginationElement.hidden = true; // 새 검색 시작 시 페이징 정보 숨김
        }

        // 초기 로딩 시에만 스켈레톤 UI 표시
        if (apiStatus === 'loading' && currentItemCount === 0) {
            this.loadingComponent?.show();
        } else {
            this.loadingComponent?.hide();
        }

        if (apiStatus === 'error') {
            clearListContainer(this.listContainer); // 오류 발생 시 목록 비우기
            this.renderMessage("error");
            return;
        }

        if (apiStatus === 'success' && total === 0) {
            clearListContainer(this.listContainer); // 결과 없을 시 목록 비우기
            this.renderMessage("notFound");
            this.updatePagingInfo(state);
            return;
        }

        // 새로운 아이템만 선택하여 추가
        const existingItemCount = this.listContainer.children.length;
        const newItems = searchResults.slice(existingItemCount);

        if (newItems.length > 0) {
            const fragment = new DocumentFragment();
            newItems
                .map((item, index) => this.createItem(item, existingItemCount + index))
                .forEach(itemElement => itemElement && fragment.appendChild(itemElement));
            this.listContainer.appendChild(fragment);
        }
        
        this.updatePagingInfo(state);

        // Observer 관리
        this.observer?.disconnect();
        if (searchKeyword && currentItemCount < total) {
             this.observer?.observe();
        }
    }

    private createItem(data: ISearchBook, index: number): HTMLElement | null {
        const bookItem = new BookItem(data);
        bookItem.dataset.index = index.toString();
        return bookItem;
    }

    private updatePagingInfo(state: AppState) {
        const { searchKeyword, currentItemCount, total, itemsPerPage } = state;

        if (!searchKeyword) {
            this.paginationElement.hidden = true;
            return;
        }

        const obj = {
            keyword: `${searchKeyword}`,
            length: `${currentItemCount.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${itemsPerPage}개씩`,
        };

        for (const [key, value] of Object.entries(obj)) {
            const element = this.paginationElement.querySelector(`.__${key}`) as HTMLElement;
            if (element) element.textContent = value;
        }
        this.paginationElement.hidden = false;
    }
    
    private renderMessage(type: "notFound" | "error" | "message" = "message") {
        const messageTemplate = document.querySelector(`#tp-${type}`) as HTMLTemplateElement;
        if (!messageTemplate) return;

        while (this.listContainer.firstChild) {
            this.listContainer.removeChild(this.listContainer.firstChild);
        }
        this.listContainer.appendChild(messageTemplate.content.cloneNode(true));
        this.paginationElement.hidden = true;
    }
}