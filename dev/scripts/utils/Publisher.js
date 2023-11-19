export default class Publisher {
    constructor() {
        this.subscribers = [];
    }
    subscribe(callback) {
        this.subscribers.push(callback);
    }
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter((subscriber) => subscriber !== callback);
    }
    notify(payload) {
        this.subscribers.forEach((callback) => callback(payload));
    }
}
//# sourceMappingURL=Publisher.js.map