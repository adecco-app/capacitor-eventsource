import { WebPlugin } from '@capacitor/core';
import { EventSourceOptions, EventSourcePlugin } from './definitions';
export declare class EventSourceWeb extends WebPlugin implements EventSourcePlugin {
    private url?;
    private eventSource?;
    private opened;
    constructor();
    configure(options: EventSourceOptions): Promise<void>;
    open(): Promise<void>;
    onError(ev: any): void;
    onMessage(ev: MessageEvent): void;
    onOpen(ev: any): void;
    close(): Promise<void>;
}
declare const EventSourcePluginImpl: EventSourceWeb;
export { EventSourcePluginImpl as EventSource };
