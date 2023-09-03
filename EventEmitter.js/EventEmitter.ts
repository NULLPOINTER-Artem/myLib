export class EventEmitter {
    events: {};

    constructor() {
        this.events = {};
    }

    subscribe(name: string, handler: Function) {
        if (!this.events[name]) this.events[name] = [];
        this.events[name].push(handler);

        return this.unsubscribe.bind(this, name, handler);
    }

    unsubscribe(name: string, handler: Function) {
        this.events[name] = this.events[name].filter((fn: Function) => handler !== fn);
        if (this.events[name].length <= 0) delete this.events[name];
    }

    once(name: string, handler: Function) {
        const self = this;

        function onceHandler(...args: any[]) {
            self.unsubscribe(name, onceHandler);
            handler.apply(self, args);
        }

        this.subscribe(name, onceHandler);
    }

    emit(name: string, data: any) {
        this.events[name] && this.events[name].forEach((handler: Function) => handler.call(null, data));
    }
}

export const Singleton = (() => {
    let instance: EventEmitter;

    function createInstance() {
        return new EventEmitter();
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
            }

            return instance;
        },
    };
})();
