/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-28 22:29:54
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-03 16:33:05
 * @FilePath: \react18-study\src\react-reconciler\src\ReactFiberClassUpdateQueue.js
 */

import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdates';

export const UpdateState = 0;

export function initialUpdateQueue(fiber) {
    // 创建一个新的更新队列
    // pending其实是一个循环链表
    const queue = {
        shared: {
            pending: null,
        },
    };
    fiber.updateQueue = queue;
}

export function createUpdate() {
    const update = { tag: UpdateState };
    return update;
}
export function enqueueUpdate(fiber, update) {
    const updateQueue = fiber.updateQueue;
    const pending = updateQueue.pending;
    if (pending === null) {
        update.next = update;
    } else {
        update.next = pending.next;
        pending.next = update;
    }
    updateQueue.shared.pending = update;
    // 返回根节点 从当前的fiber一直到根节点
    // (现在还没有讲更新优先级关系)
    return markUpdateLaneFromFiberToRoot(fiber);
}

/**
 * 根据老状态和更新队列中的更新计算最新的状态
 * @param {*} workInProgress 要计算的fiber
 */
export function processUpdateQueue(workInProgress) {
    const queue = workInProgress.updateQueue;
    const pendingQueue = queue.shared.pending;
    // 如果有更新，或者说更新队列里有内容
    if (pendingQueue !== null) {
        // 清除等待生效的更新
        queue.shared.pending = null;
        // 获取更新队列中最后一个更新 update = {payload: {element: 'h1'}}
        const lastPendingUpdate = pendingQueue;
        // 指向第一个更新
        const firstPendingUpdate = lastPendingUpdate.next;
        // 把更新链表剪开，变成一个单链表
        lastPendingUpdate.next = null;
        // 获取老的状态 null
        let newState = workInProgress.memoizedState;
        let update = firstPendingUpdate;
        while (update) {
            // 根据老状态和更新计算新状态
            newState = getStateFromUpdate(update, newState);
            update = update.next;
        }
        // 把最终计算到的状态赋值给memoizedState;
    }
}

/**
 * 根据老状态和更新计算新状态
 * @param {*} update 更新的对象其实有很多类型
 * @param {*} prevState
 */
function getStateFromUpdate(update, prevState) {
    
}
