export default class Publisher {
    constructor() {
        this.subscribers = [];
    }
    subscribe(callback) {
        this.subscribers.push(callback);
    }
    unssubscribe(callback) {
        this.subscribers = this.subscribers.filter((subscriber) => subscriber !== callback);
    }
    notify() {
        this.subscribers.forEach((callback) => callback());
    }
}
//# sourceMappingURL=Publisher.js.map