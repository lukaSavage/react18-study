
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
}