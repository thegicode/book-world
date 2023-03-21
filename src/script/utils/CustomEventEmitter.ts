
interface CustomEventDetail {
    [key: string]: unknown;
}

class CustomEventEmitter<T extends CustomEventDetail>  {
    private _bus: HTMLDivElement

    constructor() {
        this._bus = document.createElement('div')
    }

    add(event: string, callback: EventListenerOrEventListenerObject):void {
        this._bus.addEventListener(event, callback)
    }

    remove(event: string, callback: EventListenerOrEventListenerObject) {
        this._bus.removeEventListener(event, callback)
    }

    dispatch(event: string, detail: T = {} as T): void {
        this._bus.dispatchEvent(new CustomEvent(event, { detail }))
    }
}

export default new CustomEventEmitter()
