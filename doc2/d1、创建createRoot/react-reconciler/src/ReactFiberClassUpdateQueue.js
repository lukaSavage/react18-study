/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-28 22:29:54
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-03 16:33:05
 * @FilePath: \react18-study\src\react-reconciler\src\ReactFiberClassUpdateQueue.js
 */

import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdates';
import assign from 'shared/assign'

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
