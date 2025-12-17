import {
    ImmediatePriority,
    UserBlockingPriority,
    NormalPriority,
    LowPriority,
    IdlePriority,
} from './SchedulerPriorities';
import { push, pop, peek } from './SchedulerMinHeap';
import { frameYieldMs } from './SchedulerFeatureFlags';

// // 此处后面我们会实现一个优先队列(这是以前写的)
export function scheduleCallback(callback) {
    requestIdleCallback(callback);
}

const getCurrentTime = () => performance.now();

/**
 * 按优先级执行任务
 * @param {*} priorityLevel
 * @param {*} callback
 */
// export function scheduleCallback(priorityLevel, callback) {
//     // 获取当前的时间
//     const currentTime = getCurrentTime();
//     // 此任务的开始时间
//     const startTime = currentTime;
//     // 超时时间
//     let timeout;
//     switch (priorityLevel) {
//         case value:
//             break;

//         default:
//             break;
//     }
// }

const maxSigned31BitInt = 1073741823;
// 立刻超时过期
const IMMEDIATE_PRIORITY_TIMEOUT = -1;
// 最终过期250ms
const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
// 正常的优先级过期时间
const NORMAL_PRIORITY_TIMEOUT = 5000;
// 低优先级过期时间
const LOW_PRIORITY_TIMEOUT = 10000;
// 永远不过期
const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;
// 任务ID计数器
let taskIdCounter = 1;
// 任务最小堆
const taskQueue = [];
let scheduledHostCallback = null;
// 开始执行任务的时间
let startTime = -1;
let currentTask = null;
const frameInterval = frameYieldMs;
const channel = new MessageChannel();
const port = channel.port2;

channel.port1.onmessage = performWorkUntilDeadline;

function schedulePerformWorkUntilDeadline() {
    port.postMessage(null);
}

function performWorkUntilDeadline() {
    if (scheduledHostCallback !== null) {
        // 先获取开始执行任务的时间
        startTime = getCurrentTime();
        // 是否有更多的工作要做
        let hasMoreWork = true;
        try {
            hasMoreWork = scheduledHostCallback(startTime);
        } finally {
            if (hasMoreWork) {
                schedulePerformWorkUntilDeadline();
            } else {
                scheduledHostCallback = null;
            }
        }
    }
}

function unstable_scheduleCallback(priorityLevel, callback) {
    const currentTime = getCurrentTime();
    const startTime = currentTime;
    let timeout;
    switch (priorityLevel) {
        case ImmediatePriority:
            timeout = IMMEDIATE_PRIORITY_TIMEOUT;
            break;
        case UserBlockingPriority:
            timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
            break;
        case IdlePriority:
            timeout = IDLE_PRIORITY_TIMEOUT;
            break;
        case LowPriority:
            timeout = LOW_PRIORITY_TIMEOUT;
            break;
        case NormalPriority:
        default:
            timeout = NORMAL_PRIORITY_TIMEOUT;
            break;
    }
    // 计算此任务的过期时间
    const expirationTime = startTime + timeout;
    const newTask = {
        id: taskIdCounter++,
        callback, // 回调函数或者说任务函数
        priorityLevel, // 优先级别
        startTime, // 任务的开始时间
        expirationTime, // 任务的过期时间
        sortIndex: expirationTime, // 排序依赖
    };
    newTask.sortIndex = expirationTime;
    // 向任务最小堆里添加任务，排序的依赖是过期时间
    push(taskQueue, newTask);
    // flushwork执行工作，刷新工作，执行任务
    requestHostCallback(flushWork);
    return newTask;
}

function requestHostCallback(callback) {
    // 先缓存回调函数
    scheduledHostCallback = callback;
    // 执行工作直到截止时间
    schedulePerformWorkUntilDeadline();
}

/**
 * 开始执行任务队列中的人物
 * @param {*} initialTime 
 * @returns 
 */
function flushWork(initialTime) {
    return workLoop(initialTime);
}

function shouldYieldToHost() {
    // 用当前时间减去开始的时间就是过去的时间
    const timeElapsed = getCurrentTime() - startTime;
    // 如果流逝或者说经过的时间小于5ms，那就不需要放弃执行
    if (timeElapsed < frameInterval) {
        return false;
    } // 否则就是表示5毫秒用完了，需要放弃执行
    return true;
}
function workLoop(initialTime) {
    let currentTime = initialTime;
    // 取出优先级最高的任务
    currentTask = peek(taskQueue);
    while (currentTask !== null) {
        // 如果此任务的过期时间小于当前时间，也就是说没有过期，并且需要放弃执行 时间片到期
        if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
            // 跳出工作循环
            break;
        }
        // 取出当前的任务中的回调函数 performConcurrentWorkOnRoot 
        const callback = currentTask.callback;
        if (typeof callback === 'function') {
            currentTask.callback = null;
            // 执行工作，如果返回新的函数，则表示当前的工作没有完成
            const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
            const continuationCallback = callback(didUserCallbackTimeout);
            currentTime = getCurrentTime();
            if (typeof continuationCallback === 'function') {
                currentTask.callback = continuationCallback;
                return true;
            }
            // 如果此任务已经完成，这不需要再继续执行了，可以把此任务弹出
            if (currentTask === peek(taskQueue)) {
                pop(taskQueue);
            }
        } else {
            pop(taskQueue);
        }
        // 如果当期的任务执行完了，或者当前的任务不合法，取出下一个任务执行
        currentTask = peek(taskQueue);
    }
    // 如果循环结束后还有未完成的任务，那就表示hasMoreWork = true
    if (currentTask !== null) {
        return true;
    }
    return false;
}

export { NormalPriority as unstable_NormalPriority, unstable_scheduleCallback, shouldYieldToHost as shouldYield };
