import { ReactiveController, ReactiveControllerHost } from "lit";
import Publisher from "./Publisher";

export class StoreController<T = unknown> implements ReactiveController {
    private host: ReactiveControllerHost;
    private publisher: Publisher<T>;
    private callback?: (payload?: T) => void;

    private handleUpdate = (payload?: T) => {
        if (this.callback) {
            this.callback(payload);
        } else {
            this.host.requestUpdate();
        }
    };

    constructor(
        host: ReactiveControllerHost,
        publisher: Publisher<T>,
        callback?: (payload?: T) => void
    ) {
        (this.host = host).addController(this);
        this.publisher = publisher;
        this.callback = callback;
    }

    hostConnected() {
        this.publisher.subscribe(this.handleUpdate);
    }

    hostDisconnected() {
        this.publisher.unsubscribe(this.handleUpdate);
    }
}