import { scheduleCallback } from 'scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';
import { completeWork } from './ReactFiberCompleteWork';
import { ChildDeletion, MutationMask, NoFlags, Passive, Placement, Update } from './ReactFiberFlags';
import {
    commitMutationEffectsOnFiber,
    commitPassiveUnmountEffects,
    commitPassiveMountEffects,
} from './ReactFiberCommitWork';
import { FunctionComponent, HostComponent, HostRoot, HostText } from './ReactWorkTags';
import { finishQueueingConcurrentUpdates } from './ReactFiberConcurrentUpdates';

let workInProgress = null;
let workInProgressRoot = null;
let rootDoesHavePassiveEffects = false; // 此根节点上有没有useEffect类似的副作用
let rootWithPendingPassiveEffects = null; // 具有useEffect副作用的根节点 FiberRootNode, 根fiber.stateNode
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
    if (workInProgressRoot) return;
    workInProgressRoot = root;
    // 告诉浏览器要执行此函数
    scheduleCallback(preformConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 根据虚拟dom构建fiber,之后要创建真实的DOM节点，还需要把真实的DOM容器插入容器
 * @param {*} root
 */
function preformConcurrentWorkOnRoot(root) {
    // 以同步的方式渲染根节点，初次渲染的时候，都是同步
    renderRootSync(root);
    const finishedWork = root.current.alternate;
    console.log('performConcurrentWorkOnRoot', root);
    // 开始进入提交阶段，就是执行副作用，修改真实DOM
    root.finishedWork = finishedWork;
    commitRoot(root);
    workInProgressRoot = null;
}
function flushPassiveEffect() {
    if (rootWithPendingPassiveEffects !== null) {
        const root = rootWithPendingPassiveEffects;
        // 执行卸载副作用，destroy
        commitPassiveUnmountEffects(root.current);
        // 执行挂载副作用 create
        commitPassiveMountEffects(root, root.current);
    }
}
function commitRoot(root) {
    // 先获取新的构建好的fiber树的根fiber tag=3
    const { finishedWork } = root;
    if ((finishedWork.subtreeFlags & Passive) !== NoFlags || (finishedWork.flags & Passive) !== NoFlags) {
        if (!rootDoesHavePassiveEffects) {
            rootDoesHavePassiveEffects = true;
            scheduleCallback(flushPassiveEffect);
        }
    }
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    // 先判断根fiber子树有没有副作用
    const subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
    // 再判断根fiber自己身上有没有副作用
    const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
    // 如果自己的副作用或者子节点有副作用就惊醒提交DOM操作
    if (subtreeHasEffects || rootHasEffect) {
        // 当DOM执行变更之后
        commitMutationEffectsOnFiber(finishedWork, root);
        if (rootDoesHavePassiveEffects) {
            rootDoesHavePassiveEffects = false;
            rootWithPendingPassiveEffects = root;
        }
    }
    // 等DOM变更后，就可以把让root的current指向新的fiber树
    root.current = finishedWork;
}

function prepareFreshStack(root) {
    workInProgress = createWorkInProgress(root.current, null);
    // 完成队列的并发更新
    finishQueueingConcurrentUpdates();
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

function printFinishedWork(fiber) {
    const { flags, deletions } = fiber;
    if ((flags & ChildDeletion) !== NoFlags) {
        fiber.flags &= ~ChildDeletion;
        console.log('子节点有删除' + deletions.map(fiber => `${fiber.type}#${fiber.memoizedProps.id}`).join());
    }

    let child = fiber.child;
    while (child) {
        printFinishedWork(child);
        child = child.sibling;
    }
    // 说明该fiber有副作用
    if (fiber.flags !== 0) {
        // console.log(fiber.flags, fiber.tag, fiber.type, fiber.memoizedProps);
        console.log(
            getFlags(fiber),
            getTag(fiber.tag),
            typeof fiber.type === 'function' ? fiber.type.name : fiber.type,
            fiber.memoizedProps
        );
    }
}

function getFlags(fiber) {
    const { flags } = fiber;
    if (flags === (Placement | Update)) {
        return '移动';
    }
    if (flags === Placement) {
        return '插入';
    }
    if (flags === Update) {
        return '更新';
    }
    return flags;
}

function getTag(tag) {
    switch (tag) {
        case FunctionComponent:
            return 'FunctionComponent';
        case HostRoot:
            return 'HostRoot';
        case HostComponent:
            return 'HostComponent';
        case HostText:
            return 'HostText';
        default:
            return tag;
    }
}
