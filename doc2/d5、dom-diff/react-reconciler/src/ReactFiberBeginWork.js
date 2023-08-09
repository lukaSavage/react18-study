import logger, { indent } from 'shared/logger';
import { FunctionComponent, HostComponent, HostRoot, HostText, IndeterminateComponent } from './ReactWorkTags';
import { processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import { renderWithHooks } from 'react-reconciler/src/ReactFiberHooks';

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
 * 挂载函数组件
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的fiber
 * @param {*} Component 组件类型，也就是函数组件的定义
 */
export function mountIndeterminateComponent(current, workInProgress, Component) {
    // 拿到将要挂载的属性
    const props = workInProgress.pendingProps;
    // 调用函数并将props传入或得返回值
    // const value = Component(props);
    const value = renderWithHooks(current, workInProgress, Component, props);
    // 变更标签类型为函数组件
    workInProgress.tag = FunctionComponent;
    // 提交子节点
    reconcileChildren(current, workInProgress, value);
    // 最后返回
    return workInProgress.child;
}

export function updateFunctionComponent(current, workInProgress, Component, nextProps) {
    const nextChildren = renderWithHooks(current, workInProgress, Component, nextProps);
    // 提交子节点
    reconcileChildren(current, workInProgress, nextChildren);
    // 最后返回
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
        case IndeterminateComponent:
            return mountIndeterminateComponent(current, workInProgress, workInProgress.type);
        case FunctionComponent: {
            const Component = workInProgress.type;
            const nextProps = workInProgress.pendingProps;
            return updateFunctionComponent(current, workInProgress, Component, nextProps);
        }
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
