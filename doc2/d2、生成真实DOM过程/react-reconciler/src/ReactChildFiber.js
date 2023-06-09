import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement, createFiberFromText } from './ReactFiber';
import { Placement } from './ReactFiberFlags';
import isArray from 'shared/isArray';
/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
    shouldTrackSideEffects = true;
    function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
        // 因为我们实现的是初次挂载，老节点currentFirstFiber肯定是没有的，所以可以直接根据虚拟DOM创建新的Fiber节点
        const created = createFiberFromElement(element);
        created.return = returnFiber;
        return created;
    }

    /**
     * 设置副作用
     * @param {*} newFiber
     * @param {*} newIndex
     * @returns
     */
    function placeSingleChild(newFiber, newIndex) {
        // 如果为true,说明要添加副作用
        if (shouldTrackSideEffects) {
            // 要在最后的提交阶段插入此节点 (React分为渲染和更新阶段)
            newFiber.flags |= Placement;
        }
        return newFiber;
    }

    function createChild(returnFiber, newChild) {
        if ((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number') {
            const created = createFiberFromText(`${newChild}`);
            created.return = returnFiber;
            return created;
        }

        if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE: {
                    const created = createFiberFromElement(newChild);
                    created.return = returnFiber;
                    return created;
                }
                default:
                    break;
            }
        }
    }
    function placeChild(newFiber, newIdx) {
        newFiber.index = newIdx;
        if (shouldTrackSideEffects) {
            // 如果一个fiber它的flags上有Placement,说明此节点需要创建真实DOM并且插入到父容器中
            // 如果父fiber节点是初次挂载，shouldTrackSideEffects=false, 不需要添加flags
            // 这种情况下会在完成阶段把所有的子节点全部添加到自己身上
            newFiber.flags |= Placement;
        }
    }
    function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
        let resultingFirstChild = null; // 返回的第一个新儿子
        let previousNewFiber = null; // 上一个的新的fiber
        let newIdx = 0;
        for (; newIdx < newChildren.length; newIdx++) {
            const newFiber = createChild(returnFiber, newChildren[newIdx]);
            if (newFiber === null) continue;
            placeChild(newFiber, newIdx);
            // 如果previousNewFiber为null, 说明这是第一个fiber
            if (previousNewFiber === null) {
                resultingFirstChild = newFiber; // 这个newFiber就是大儿子
            } else {
                // 否则说明不是大儿子，就把这个newFiber添加上一个子节点后面
                previousNewFiber.sibling = newFiber;
            }
            // 让newFiber成为最后一个或者说上一个子fiber
            previousNewFiber = newFiber;
        }
        return resultingFirstChild;
    }

    /**
     * 比较子fiber(新老fiber的DIFF，即用老的子fiber链表和新的虚拟DOM进行比较的过程)
     * @param {*} returnFiber 新的父Fiber
     * @param {*} currentFirstFiber 老fiber的第一个子fiber current一般老说指的是老的
     * @param {*} newChild 新的子虚拟DOM h1虚拟DOM
     */
    function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
        // 现在只暂时考虑新的节点只有一个的情况
        if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstFiber, newChild));
                default:
                    break;
            }
        }
        // 多节点是一个数组
        if (isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
        }
        return null;
    }

    return reconcileChildFibers;
}

// 有老的父fiber更新的时候用这个
export const reconcileChildFibers = createChildReconciler(true);
// 如果没有老的父fiber,初次挂在的时候用这个
export const mountChildFibers = createChildReconciler(false);
