import assign from 'shared/assign';

const MouseEventInterface = {
    clientX: 0,
    clientY: 0,
};

function functionThatReturnsTrue() {
    return true;
}

function functionThatReturnsFalse() {
    return false;
}

function createSyntheticEvent(inter) {
    /**
     * 合成事件的基类
     * @param {*} reactName React属性名 onClick
     * @param {*} reactEventType click
     * @param {*} targetInst 事件源对应的fiber实例
     * @param {*} nativeEvent 原生事件对象
     * @param {*} nativeEventTarget 原生事件源 span 事件源对应的那个真实DOM
     */
    class SyntheticBaseEvent {
        constructor(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
            this._reactName = reactName;
            this.type = reactEventType;
            this._targetInst = targetInst;
            this.nativeEvent = nativeEvent;
            this.target = nativeEventTarget;
            for (const propName in inter) {
                if (!inter.hasOwnProperty(propName)) {
                    continue;
                }
                this[propName] = nativeEvent[propName];
            }
            // 是否已经阻止默认事件
            this.isDefaultPrevented = functionThatReturnsFalse;
            // 是否已经阻止继续传播(冒泡或者传播)
            this.isPropagationStopped = functionThatReturnsFalse;
            return this;
        }
    }
    assign(SyntheticBaseEvent.prototype, {
        preventDefault() {
            const event = this.nativeEvent;
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
            this.isDefaultPrevented = functionThatReturnsTrue;
        },
        stopPropagation() {
            const event = this.nativeEvent;
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
            this.isPropagationStopped = functionThatReturnsTrue;
        },
    });
    return SyntheticBaseEvent;
}

export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
