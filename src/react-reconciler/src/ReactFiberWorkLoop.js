import { scheduleCallback } from 'scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';
import { completeWork } from './ReactFiberCompleteWork';

let workInProgress = null;
/**
 * 计划更新root
 * 源码中此处有一个任务调度的功能
 * @param {*} root 根Fiber
 */
export function scheduleUpdateOnFiber(root) {
    // 确保调度执行root上的更新
    ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
    // 告诉浏览器要执行此函数
    scheduleCallback(preformConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 根据虚拟dom构建fiber,之后要创建真实的DOM节点，还需要把真实的DOM容器插入容器
 * @param {*} root
 */
function preformConcurrentWorkOnRoot(root) {
    console.log('performConcurrentWorkOnRoot', root);
    // 以同步的方式渲染根节点，初次渲染的时候，都是同步
    renderRootSync(root);
}

function prepareFreshStack(root) {
    workInProgress = createWorkInProgress(root.current, null);
}

function renderRootSync(root) {
    // 开始构建fiber树
    prepareFreshStack(root);
    workLoopSync();
}

function workLoopSync() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}

/**
 * 执行一个工作单元
 * @param {*} unitOfWork
 */
function performUnitOfWork(unitOfWork) {
    // 获取新的fiber对应的老fiber
    const current = unitOfWork.alternate;
    // 完成当前fiber的子fiber链表构建后
    const next = beginWork(current, unitOfWork);
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    if (next === null) {
        // workInProgress = null;
        // todo: 如果没有子节点表示当前的fiber已经完成了
        completeUnitOfWork(unitOfWork);
    } else {
        // 如果有子节点，就让子节点成为下一个工作单元
        workInProgress = next;
    }
}

function completeUnitOfWork(unitOfWork) {
    let completedWork = unitOfWork;
    do {
        debugger
        const current = completedWork.alternate;
        const returnFiber = completedWork.return;
        // 执行此fiber的完成工作
        completeWork(current, completedWork);
        // 如果有弟弟，就构建弟弟对应的fiber子链表
        const siblingFiber = completedWork.sibling;
        if (siblingFiber !== null) {
            workInProgress = siblingFiber;
            return;
        }

        // 如果没有弟弟，说明这是当期那完成的就是父fiber的最后一个节点
        // 也就是华硕一个父fiber，所有的子fiber全部完成了
        completedWork = returnFiber;
        workInProgress = completedWork;
    } while (completedWork !== null);
}
