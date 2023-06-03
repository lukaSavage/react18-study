/*
 * @Descripttion: 
 * @Author: lukasavage
 * @Date: 2023-05-28 22:29:54
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-03 16:33:05
 * @FilePath: \react18-study\src\react-reconciler\src\ReactFiberClassUpdateQueue.js
 */

import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";

export function initialUpdateQueue(fiber) {
    // 创建一个新的更新队列
    // pending其实是一个循环链表
    const queue = {
        shared: {
            pending: null
        }
    }
    fiber.updateQueue = queue;
}

export function createUpdate() {
    const update = {};
    return update;
}
export function enqueueUpdate(fiber, update) {
    const updateQueue = fiber.updateQueue;
    const pending = updateQueue.pending;
    if(pending === null) {
        update.next = update;
    } else {
        update.next = pending.next;
        pending.next =update;
    }
    updateQueue.shared.pending = update;
    // 返回根节点 从当前的fiber一直到根节点
    // (现在还没有讲更新优先级关系)
    return markUpdateLaneFromFiberToRoot(fiber);
}