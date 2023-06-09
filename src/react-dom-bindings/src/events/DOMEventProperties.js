import { registerTwoPhaseEvent } from './EventRegistry';

// 存储事件，如click、cancel、abort等
const simpleEventPluginEvents = ['click'];

export const topLevelEventsToReactNames = new Map();
function registerSimpleEvent(domEventName, reactName) {
    /* 
        元素的onClick事件可以在哪里取得到？
        可以从元素的fiber的属性上取到 props.onClick
    */
    // 把原生事件名和处理函数的名字进行映射或者说绑定，比如onClick => ['click']
    topLevelEventsToReactNames.set(domEventName, reactName);
    registerTwoPhaseEvent(reactName, [domEventName]); // onClick click
}

export function registerSimpleEvents() {
    for (let i = 0; i < simpleEventPluginEvents.length; i++) {
        const eventName = simpleEventPluginEvents[i];
        const domEventName = eventName.toLowerCase(); // click
        const capitalizeEvent = eventName[0].toUpperCase() + eventName.slice(1); // ==> Click
        registerSimpleEvent(domEventName, `on${capitalizeEvent}`); // click, onClick
    }
}
