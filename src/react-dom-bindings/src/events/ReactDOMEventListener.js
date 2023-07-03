import getEventTarget from './getEventTarget';
import { getClosestInstanceFromNode } from '../client/ReactDOMComponentTree';
import { dispatchEventForPluginEventSystem } from './DOMPluginEventSystem';

/**
 * 创建事件监听包裹属性
 * @param {*} targetContainer div#root
 * @param {*} domEventName 'click'、cancel等
 * @param {*} eventSystemFlags 默认是0指的是冒泡 4是捕获
 * @returns dispatchDiscreateEvent函数
 */
export function createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags) {
    const listenerWrapper = dispatchDiscreateEvent;

    return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
}

/**
 * 派发离散的事件的监听函数
 * @param {*} domEventName 事件名 click
 * @param {*} eventSystemFlags 阶段 0代表冒泡 4代表捕获
 * @param {*} container 容器div#root
 * @param {*} nativeEvent 原生的事件
 */
function dispatchDiscreateEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
}

/**
 * 此方法就是委托给容器的回调，当容器#root在捕获或者说冒泡阶段处理事件的时候会执行此函数
 * @param {*} domEventName 'click'、cancel等
 * @param {*} eventSystemFlags 默认是0指的是冒泡 4是捕获
 * @param {*} container 容器div#root
 * @param {*} nativeEvent
 */
export function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    // 1、获取事件源，他是一个真实DOM
    const nativeEventTarget = getEventTarget(nativeEvent);
    // 2、从真实的DOM节点上获取它对应的fiber节点(为了冒泡和捕获)
    const targetInst = getClosestInstanceFromNode(nativeEventTarget);
    // 3、派发事件
    debugger
    dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer);
}
