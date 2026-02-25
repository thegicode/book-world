import { ReactiveController, ReactiveControllerHost } from "lit";

export interface InfiniteScrollOptions {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
}

export class InfiniteScrollController implements ReactiveController {
    private host: ReactiveControllerHost & HTMLElement;
    private observer: IntersectionObserver | null = null;
    private sentinelSelector: string;
    private loadMoreCallback: () => void;
    private options: InfiniteScrollOptions;
    private isPaused = false;

    constructor(
        host: ReactiveControllerHost & HTMLElement,
        sentinelSelector: string,
        loadMoreCallback: () => void,
        options: InfiniteScrollOptions = { rootMargin: "200px", threshold: 0 }
    ) {
        (this.host = host).addController(this);
        this.sentinelSelector = sentinelSelector;
        this.loadMoreCallback = loadMoreCallback;
        this.options = options;
    }

    hostConnected() {
        this.initObserver();
    }

    hostDisconnected() {
        this.disconnect();
    }

    hostUpdated() {
        this.updateSentinel();
    }

    private initObserver() {
        this.observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !this.isPaused) {
                this.loadMoreCallback();
            }
        }, this.options);
    }

    private updateSentinel() {
        const sentinel = this.host.querySelector(this.sentinelSelector);
        if (sentinel && this.observer) {
            this.observer.unobserve(sentinel);
            if (!this.isPaused) {
                this.observer.observe(sentinel);
            }
        }
    }

    /**
     * 무한 스크롤 감시를 일시 정지하거나 재개합니다.
     * 데이터가 더 이상 없거나 로딩 중일 때 유용합니다.
     */
    public setPaused(paused: boolean) {
        this.isPaused = paused;
        this.updateSentinel();
    }

    private disconnect() {
        this.observer?.disconnect();
        this.observer = null;
    }
}
