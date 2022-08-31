import { registerPlugin } from '@capacitor/core';
const EventSource = registerPlugin('EventSource', {
    web: () => import('./web').then((m) => new m.EventSourceWeb()),
});
export * from './definitions';
export { EventSource };
//# sourceMappingURL=index.js.map