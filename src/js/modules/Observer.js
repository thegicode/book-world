export default class Observer {
    constructor(target, callback) {
        this.target = target
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this, callback))
        // this.observe()
    }

    observe() {
        this.observer.observe(this.target)
    }

    unobserve() {
        this.observer.unobserve(this.target)
    }

    disconnect() {
        this.observer.disconnect()
    }

    handleIntersection(callback, changes) {
        changes.forEach(changes => {
            if (changes.isIntersecting) {
                this.unobserve()
                callback()
            }
        })
    }
}