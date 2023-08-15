import { registerSimpleEvents, topLevelEventsToReactNames } from '../DOMEventProperties';
import { IS_CAPTURE_PHASE } from '../EventSystemFlags';
import { accumulateSinglePhaseListeners } from '../DOMPluginEventSystem';
import { SyntheticMouseEvent } from '../SyntheticEvent'
/**
 * 把我们要执行的回调函数添加到dispatchQueue中
 * @param {*} dispatchQueue 派发队列，里面防止我们的监听函数
 * @param {*} domEventName DOM事件名 click
 * @param {*} targetInst 目标fiber
 * @param {*} nativeEvent 原生事件
 * @param {*} nativeEventTarget 原生事件源
 * @param {*} eventSystemFlags 事件系统标识 0表示冒泡 4表示捕获
 * @param {*} targetContainer 目标容器 div#root
 */
function extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
) {
    const reactName = topLevelEventsToReactNames.get(domEventName); // click => onClick
    let SyntheticEventCtor; // 合成事件的构建函数
    switch (domEventName) {
        case 'click':
            SyntheticEventCtor = SyntheticMouseEvent;
            break;
    
        default:
            break;
    }
    // 看是否为捕获阶段
    const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0; // 判断是否为捕获阶段
    const listeners = accumulateSinglePhaseListeners(targetInst, reactName, nativeEvent.type, isCapturePhase);
    // 如果有要执行的监听函数的话[onClickCapture, onClickCapture]=[ChildCapture, parentCapture]
    if (listeners.length > 0) {
        const event = new SyntheticEventCtor(reactName, domEventName, null, nativeEvent, nativeEventTarget);
        dispatchQueue.push({
            event, // 合成事件实例
            listeners // 监听函数数组
        })
    }
    console.log(listeners);
}

export { registerSimpleEvents as registerEvents, extractEvents };
