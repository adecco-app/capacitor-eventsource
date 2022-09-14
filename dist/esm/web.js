import { WebPlugin } from '@capacitor/core';
import { READY_STATE } from './definitions';
export class EventSourceWeb extends WebPlugin {
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
            state: READY_STATE.CONNECTING,
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
        this.notifyListeners('readyStateChanged', { state: READY_STATE.OPEN });
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
                state: READY_STATE.CLOSED,
            });
        }
    }
}
const EventSourcePluginImpl = new EventSourceWeb();
export { EventSourcePluginImpl as EventSource };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(EventSourcePluginImpl);
//# sourceMappingURL=web.js.map