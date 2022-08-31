var capacitorEventSource = (function (exports, core) {
    'use strict';

    exports.READY_STATE = void 0;
    (function (READY_STATE) {
        READY_STATE[READY_STATE["CONNECTING"] = 0] = "CONNECTING";
        READY_STATE[READY_STATE["OPEN"] = 1] = "OPEN";
        READY_STATE[READY_STATE["CLOSED"] = 2] = "CLOSED";
    })(exports.READY_STATE || (exports.READY_STATE = {}));

    const EventSource = core.registerPlugin('EventSource', {
        web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.EventSourceWeb()),
    });

    class EventSourceWeb extends core.WebPlugin {
        constructor() {
            super({
                name: 'EventSource',
                platforms: ['web'],
            });
            this.opened = false;
        }
        async configure(options) {
            console.debug(`EventSourceWeb.configure(${options.url})`);
            if (options.url) {
                this.url = options.url;
            }
            else {
                throw new Error('url is required');
            }
        }
        async open() {
            console.debug(`EventSourceWeb.open()`);
            if (!this.url) {
                throw new Error('You must call configure first!');
            }
            this.notifyListeners('readyStateChanged', {
                state: exports.READY_STATE.CONNECTING,
            });
            this.eventSource = new window.EventSource(this.url);
            this.eventSource.onopen = this.onOpen.bind(this);
            this.eventSource.onmessage = this.onMessage.bind(this);
            this.eventSource.onerror = this.onError.bind(this);
        }
        onError(ev) {
            this.notifyListeners('error', { error: ev === null || ev === void 0 ? void 0 : ev.message });
        }
        onMessage(ev) {
            if (this.opened) {
                this.notifyListeners('message', { message: ev === null || ev === void 0 ? void 0 : ev.data });
            }
        }
        onOpen(ev) {
            this.opened = true;
            this.notifyListeners('open', { message: ev === null || ev === void 0 ? void 0 : ev.message });
            this.notifyListeners('readyStateChanged', { state: exports.READY_STATE.OPEN });
        }
        async close() {
            console.debug(`EventSourceWeb.close()`);
            this.opened = false;
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource.onopen = null;
                this.eventSource.onmessage = null;
                this.eventSource.onerror = null;
                this.eventSource = null;
                this.notifyListeners('readyStateChanged', {
                    state: exports.READY_STATE.CLOSED,
                });
            }
        }
    }
    const EventSourcePluginImpl = new EventSourceWeb();
    core.registerWebPlugin(EventSourcePluginImpl);

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EventSourceWeb: EventSourceWeb,
        EventSource: EventSourcePluginImpl
    });

    exports.EventSource = EventSource;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
