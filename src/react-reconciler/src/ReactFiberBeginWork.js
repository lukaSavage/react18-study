import logger from 'shared/logger'
import { HostText } from './ReactWorkTags';
import { processUpdateQueue } from './ReactFiberConcurrentUpdates'

function updateHostRoot(current, workInProgress) {
    // 需要知道它的自虚拟DOM,知道它的儿子的虚拟DOM信息
    processUpdateQueue(workInProgress); // workInProgress.memoizedState={element}
    const nextState = workInProgress.memoizedState;
    const nextChildren = nextState.element;
    // 协调子节点 DOM-DIFF算法
    reconcileChildren(current, workInProgress, nextChildren);
    return workInProgress.child;
}
function updateHostComponent(current, workInProgress) {

}


/**
 * 目标是根据新虚拟DOM构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的fiber
 */
export function beginWork(current, workInProgress) {
    logger('beginWork', workInProgress);
    switch (workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(current, workInProgress);
        case HostComponent:
            return updateHostComponent(current, workInProgress);
        case HostText:
            return null;
        default:
            return null;
    }
}