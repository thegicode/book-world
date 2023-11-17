export default class Publisher {
    private subscribers: TSubscriberCallback[] = [];

    subscribe(callback: TSubscriberCallback) {
        this.subscribers.push(callback);
    }

    unssubscribe(callback: TSubscriberCallback) {
        this.subscribers = this.subscribers.filter(
            (subscriber) => subscriber !== callback
        );
    }

    notify() {
        this.subscribers.forEach((callback) => callback());
    }
}
