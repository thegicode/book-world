import { ICustomEvent, ICustomEventDetail } from "../modules/types.js";

class CustomEventEmitter<T extends ICustomEventDetail> {
    private _bus: HTMLElement;

    constructor() {
        this._bus = document.createElement("div");
    }

    add(event: string, callback: (event: ICustomEvent<T>) => void): void {
        this._bus.addEventListener(
            event,
            callback as EventListenerOrEventListenerObject
        );
    }

    remove(event: string, callback: (event: ICustomEvent<T>) => void): void {
        this._bus.removeEventListener(
            event,
            callback as EventListenerOrEventListenerObject
        );
    }

    dispatch(event: string, detail: T = {} as T): void {
        this._bus.dispatchEvent(new CustomEvent(event, { detail }));
    }
}

export default new CustomEventEmitter();
