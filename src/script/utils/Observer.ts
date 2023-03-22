export default class Observer {
    target: Element;
    observer: IntersectionObserver;

    constructor(target: Element, callback: () => void) {
        this.target = target;
        this.observer = new IntersectionObserver((changes) => {
            this.handleIntersection(changes, callback);
        });
        // this.observer = new IntersectionObserver(this.handleIntersection.bind(this, callback))
    }

    observe(): void {
        this.observer.observe(this.target);
    }

    unobserve(): void {
        this.observer.unobserve(this.target);
    }

    disconnect(): void {
        this.observer.disconnect();
    }

    handleIntersection(
        changes: IntersectionObserverEntry[],
        callback: () => void
    ): void {
        changes.forEach((change) => {
            if (change.isIntersecting) {
                this.unobserve();
                callback();
            }
        });
    }
}
