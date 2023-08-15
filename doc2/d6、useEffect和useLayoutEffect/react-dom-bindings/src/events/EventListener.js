/**
 * 添加捕获监听器
 * @param {*} target 这里的target统一为div#root
 * @param {*} eventType 'click'、'cancel'
 * @param {*} listener dispatchDiscreateEvent函数
 * @returns
 */
export function addEventCaptureListener(target, eventType, listener) {
    target.addEventListener(eventType, listener, true);
    return listener;
}

export function addEventBubbleListener(target, eventType, listener) {
    target.addEventListener(eventType, listener, false);
    return listener;
}
