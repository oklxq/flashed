export default class EventDispatcher {
    private _events: Map<string | Symbol, Set<any>>;

    constructor() {
        this._events = new Map();
    }

    addEventListener(event: string | Symbol, fn: (data: any) => void) {
        if (!this._events.has(event)) {
            this._events.set(event, new Set());
        }

        this._events.get(event).add(fn);
    }

    dispatch(event: string | Symbol, data?: any) {
        if (!this._events.has(event)) {
            return;
        }
        const fns: Set<(data: any) => void> = this._events.get(event);
        for (let fn of fns.values()) {
            fn(data);
        }
    }

    removeEventListener(event: string | Symbol, fn: any) {
        if (!this._events.has(event)) {
            return;
        }
        this._events.get(event).delete(fn);
    }
}