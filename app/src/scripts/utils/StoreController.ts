import { ReactiveController, ReactiveControllerHost } from "lit";
import bookModel, { BookModelEvent } from "@/model";

export class StoreController<T = unknown> implements ReactiveController {
    private host: ReactiveControllerHost;
    private eventName: BookModelEvent;
    private callback?: (update?: T) => void;

    private handleUpdate = (update?: T) => {
        if (this.callback) {
            this.callback(update);
        } else {
            this.host.requestUpdate();
        }
    };

    constructor(host: ReactiveControllerHost, eventName: BookModelEvent, callback?: (update?: T) => void) {
        (this.host = host).addController(this);
        this.eventName = eventName;
        this.callback = callback;
    }

    hostConnected() {
        bookModel.subscribe(this.eventName, this.handleUpdate);
    }

    hostDisconnected() {
        bookModel.unsubscribe(this.eventName, this.handleUpdate);
    }
}
