/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-29 22:16:20
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-05-29 22:28:39
 * @FilePath: \react18-study\doc\03、更新队列的理解.js
 */
function initialUpdateQueue(fiber) {
    const queue = {
        shared: {
            pending: null,
        },
    };
    fiber.updateQueue = queue;
}

function createUpdate() {
    return {};
}

function enqueueUpdate(fiber, update) {
    const updateQueue = fiber.updateQueue;
    const shared = updateQueue.shared;
    const pending = shared.pending;
    if (pending === null) {
        update.next = update;
    } else {
        // 如果更新队列不为空的话，取出第一个更新
        update.next = pending.next;
        // 然后让原来队列的最后一个next指向新的next
        pending.next = update;
    }
    updateQueue.shared.pending = update;
}

function processUpdateQueue(fiber) {
    const queue = fiber.updateQueue;
    const pending = queue.shared.pending;
    if(pending !== null) {
        queue.shared.pending = null;
        // 最后一个更新
        const lastPendingUpdate = pending;
        const firstPendingUpdate = lastPendingUpdate.next;
        // 把环状链表剪开
        lastPendingUpdate.next = null;
        let newState = fiber.memoizedState;
        let update = firstPendingUpdate;
        while(update) {
            nextState = getStateFromUpdate(update, newState);
            update = update.next;
        }
        fiber.memoizedState = newState;
    }
}

function getStateFromUpdate(update, newState) {
    return Object.assign({}, newState, update.payload);
}

let fiber = { memoizedState: { id: 1 } };
initialUpdateQueue(fiber);
let update1 = createUpdate();
update1.payload = { name: 'zhangsan' };
enqueueUpdate(fiber, update1);

let update2 = createUpdate();
update1.payload = { age: 18 };
enqueueUpdate(fiber, update1);

// 基于老状态，计算新状态
processUpdateQueue(fiber);

console.log(fiber.memoizedState);