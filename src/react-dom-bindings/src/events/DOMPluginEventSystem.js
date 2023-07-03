import { allNativeEvents } from './EventRegistry';
import * as SimpleEventPlugin from './plugins/SimpleEventPlugin';
import { IS_CAPTURE_PHASE } from './EventSystemFlags';
import { createEventListenerWrapperWithPriority } from './ReactDOMEventListener';
import { addEventCaptureListener, addEventBubbleListener } from './EventListener';
import getEventTarget from './getEventTarget';
import { HostComponent } from 'react-reconciler/src/ReactWorkTags';
import getListener from './getListener';

SimpleEventPlugin.registerEvents();

const listeningMarker = `_reactListening` + Math.random().toString(36).slice(2);

export function listenToAllSupportedEvents(rootContainerElement) {
    // 监听根容器，也就是div#root只监听一次
    if (!rootContainerElement[listeningMarker]) {
        rootContainerElement[listeningMarker] = true;
        // 遍历所有的原生事件(比如click)，进行监听
        allNativeEvents.forEach(domEventName => {
            listenToNativeEvent(domEventName, true, rootContainerElement);
            listenToNativeEvent(domEventName, false, rootContainerElement);
        });
    }
}

/**
 * 注册原生事件
 * @param {*} domEventName 原生事件
 * @param {*} isCapturePhaseListener 是否是捕获阶段
 * @param {*} target 目标DOM节点 div#root 容器节点
 */
export function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
    let eventSystemFlags = 0; // 默认是0指的是冒泡 4是捕获
    if (isCapturePhaseListener) {
        eventSystemFlags |= IS_CAPTURE_PHASE;
    }
    addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
}

/**
 * 添加事件监听
 * @param {*} targetContainer div#root
 * @param {*} domEventName 'click'、cancel等
 * @param {*} eventSystemFlags 默认是0指的是冒泡 4是捕获
 * @param {*} isCapturePhaseListener 是捕获还是冒泡阶段触发
 */
function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
    // 这里的listener代表dispatchDiscreateEvent函数
    const listener = createEventListenerWrapperWithPriority(
        targetContainer,
        domEventName,
        eventSystemFlags,
        isCapturePhaseListener
    );
    if (isCapturePhaseListener) {
        addEventCaptureListener(targetContainer, domEventName, listener);
    } else {
        addEventBubbleListener(targetContainer, domEventName, listener);
    }
}

/**
 *
 * @param {*} domEventName 'click'、cancel等
 * @param {*} eventSystemFlags 默认是0指的是冒泡 4是捕获
 * @param {*} nativeEvent 原生事件
 * @param {*} targetInst 此真实DOM对应的fiber
 * @param {*} targetContainer 目标容器
 */
export function dispatchEventForPluginEventSystem(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer
) {
    dispatchEventForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer);
}

function dispatchEventForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
    const nativeEventTarget = getEventTarget(nativeEvent);
    // 派发事件的数组(因为捕获和冒泡的关系，里面可能包含父节点或者祖辈节点的事件)
    const dispatchQueue = [];
    extractEvents(
        dispatchQueue,
        domEventName,
        targetInst,
        nativeEvent,
        nativeEventTarget,
        eventSystemFlags,
        targetContainer
    );
    console.log('dispatchQueue', dispatchQueue);
}

function extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
) {
    SimpleEventPlugin.extractEvents(
        dispatchQueue,
        domEventName,
        targetInst,
        nativeEvent,
        nativeEventTarget,
        eventSystemFlags,
        targetContainer
    );
}

export function accumulateSinglePhaseListeners(targetFiber, reactName, nativeEventType, isCapturePhase) {
    const captureName = reactName + 'Capture';
    const reactEventName = isCapturePhase ? captureName : reactName;
    const listeners = [];
    let instance = targetFiber;
    while (instance !== null) {
        const { stateNode, tag } = instance;
        if (tag === HostComponent && stateNode !== null) {
            const listener = getListener(instance, reactEventName);
            if (listener !== null && listener !== undefined) {
                listeners.push(listener);
            }
        }
        instance = instance.return;
    }
    return listeners;
}
