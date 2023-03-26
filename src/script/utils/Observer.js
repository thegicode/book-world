export default class Observer {
    constructor(target, callback) {
        this.target = target;
        this.observer = new IntersectionObserver((changes) => {
            this.handleIntersection(changes, callback);
        });
        // this.observer = new IntersectionObserver(this.handleIntersection.bind(this, callback))
    }
    observe() {
        this.observer.observe(this.target);
    }
    unobserve() {
        this.observer.unobserve(this.target);
    }
    disconnect() {
        this.observer.disconnect();
    }
    handleIntersection(changes, callback) {
        changes.forEach((change) => {
            if (change.isIntersecting) {
                this.unobserve();
                callback();
            }
        });
    }
}
//# sourceMappingURL=Observer.js.map