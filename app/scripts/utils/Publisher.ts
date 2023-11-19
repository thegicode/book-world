export default class Publisher<T = undefined> {
    private subscribers: TSubscriberCallback<T>[] = [];

    subscribe(callback: TSubscriberCallback<T>) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback: TSubscriberCallback<T>) {
        this.subscribers = this.subscribers.filter(
            (subscriber) => subscriber !== callback
        );
    }

    notify(payload?: T) {
        this.subscribers.forEach((callback) => callback(payload));
    }
}
