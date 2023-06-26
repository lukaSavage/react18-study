import logger, { indent } from 'shared/logger';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';
import { processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from 'react-dom-bindings/src/client/ReactDOMHostConfig';

/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * @param {*} current 新的父Fiber
 * @param {*} workInProgress 新的父Fiber
 * @param {*} nextChildren 新的子虚拟DOM
 */
function reconcileChildren(current, workInProgress, nextChildren) {
    // 如果此新fiber没有老fiber，说明此新fiber是新创建的，它的儿子也同样是新创建的
    if (current === null) {
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
    } else {
        // 如果有loadFiber的话，做DOM-DIFF 拿老的额子fiber链表和新的子虚拟DOM进行比较，进行最小化的更新
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
    }
}

function updateHostRoot(current, workInProgress) {
    // 需要知道它的自虚拟DOM,知道它的儿子的虚拟DOM信息
    processUpdateQueue(workInProgress); // workInProgress.memoizedState={element}
    const nextState = workInProgress.memoizedState;
    // nextChildren 就是新的子虚拟DOM
    const nextChildren = nextState.element;
    // 根据新的虚拟DOM生成子fiber链表
    reconcileChildren(current, workInProgress, nextChildren);
    return workInProgress.child;
}

/**
 * 构建原生组件的zifiber链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 */
function updateHostComponent(current, workInProgress) {
    const { type } = workInProgress;
    const nextProps = workInProgress.pendingProps;
    let nextChildren = nextProps.children;
    // 判断当前虚拟DOM它的儿子是不是一个文本独生子
    const isDirectTextChild = shouldSetTextContent(type, nextProps);
    // 如果是文本独生子
    if (isDirectTextChild) {
        nextChildren = null;
    }
    reconcileChildren(current, workInProgress, nextChildren);
    return workInProgress.child;
}

/**
 * 目标是根据新虚拟DOM构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的fiber
 * @returns 返回值是对应的父节点
 */
export function beginWork(current, workInProgress) {
    logger(' '.repeat(indent.number) + 'beginWork', workInProgress);
    indent.number += 2;
    switch (workInProgress.tag) {
        case HostRoot: // 如果是跟节点
            return updateHostRoot(current, workInProgress);
        case HostComponent: // 如果是标签节点span、div、h1、p等
            return updateHostComponent(current, workInProgress);
        case HostText:
            return null;
        default:
            return null;
    }
}
