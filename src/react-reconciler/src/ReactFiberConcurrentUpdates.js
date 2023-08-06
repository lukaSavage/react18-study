import { HostRoot } from './ReactWorkTags';
const concurrentQueue = [];
let concurrentQueuesIndex = 0;

/**
 * 把更新吸先缓存到concurrentQueue数组中
 * @param {*} fiber
 * @param {*} queue
 * @param {*} update
 */
 function enqueueUpdate(fiber, queue, update) {
    // 012存的是hook1 345存的是hooks2，以此循环
    concurrentQueue[concurrentQueuesIndex++] = fiber; // 函数组件对应的fiber
    concurrentQueue[concurrentQueuesIndex++] = queue; // 要更新的hook对应的更新队列
    concurrentQueue[concurrentQueuesIndex++] = update; // 更新对象
}

export function finishQueueingConcurrentUpdates() {
    const endIndex = concurrentQueuesIndex; // 9 只是一个边界不需要更新
    concurrentQueuesIndex = 0;
    let i = 0;
    while (i < endIndex) {
        const fiber = concurrentQueue[i++];
        const queue = concurrentQueue[i++];
        const update = concurrentQueue[i++];
        if (queue !== null && update !== null) {
            const pending = queue.pending;
            if (pending === null) {
                // 构成一个循环链表
                update.next = update;
            } else {
                update.next = pending.next;
                pending.next = update;
            }
            /* 
                queue = {
                    pending: update ==> { action, next: update }
                }
            */
            queue.pending = update;
        }
    }
}

/**
 * 把更新队列添加到更新队列中
 * @param {*} fiber 函数组件对应的fiber
 * @param {*} queue 要更新的hook对应的更新队列
 * @param {*} update 更新对象
 */
export function enqueueConcurrentHookUpdate(fiber, queue, update) {
    enqueueUpdate(fiber, queue, update);
    return getRootForUpdatedFiber(fiber);
}

function getRootForUpdatedFiber(sourceFiber) {
    let node = sourceFiber;
    let parent = node.return;
    while (parent !== null) {
        node = parent;
        parent = node.return;
    }
    // 返回FiberRootNode { containerInfo: div#root }
    return node.tag === HostRoot ? node.stateNode : null;
}

/**
 * 本来此方法要处理更新优先级的问题
 * 我们目前只实现向上找到根节点的问题
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
    let node = sourceFiber; // 当前fiber
    let parent = sourceFiber.return; // 当期fiber父fiber
    while (parent !== null) {
        node = parent;
        parent = parent.return;
    }
    // 一直回溯到根fiber
    if (node.tag === HostRoot) {
        // 直接返回FiberRootNode
        return node.stateNode;
    }
    // 出错了返回null(基本不可能~)
    return null;
}
