import logger, { indent } from 'shared/logger';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';
import { createTextInstance, createInstance, appendInitialChild, finalizeInitialChildren } from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import { NoFlags } from './ReactFiberFlags';

/**
 * 把当前的完成的fiber所有的子节点对应的真实DOM都挂载到自己父parent真实DOM节点上
 * @param {*} parent 当前完成的fiber真实的DOM节点
 * @param {*} workInProgress 完成的fiber
 */
function appendAllChildren(parent, workInProgress) {
    let node = workInProgress.child;
    while (node) {
        // 如果子节点类型是一个原生节点或者是一个文件节点
        if (node.tag === HostComponent || node.tag === HostText) {
            // 把子节点对应的真实dom节点挂载到父容器上
            appendInitialChild(parent, node.stateNode);
        } else if (node.child !== null) {
            // 如果第一个儿子不是一个原生节点，说明它可能是一个函数组件
            node = node.child;
            continue;
        }

        if (node === workInProgress) return;
        
        // 如果当前的节点没有弟弟
        while (node.sibling === null) {
            // 如果node.return 指向为顶级父fiber了，直接跳出
            if (node.return === null || node.return === workInProgress) return;
            // 回到父节点
            node = node.return;
        }
        node = node.sibling;
    }

}

/**
 * 完成一个fiber节点
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的构建的fiber
 */
export function completeWork(current, workInProgress) {
    indent.number -= 2;
    logger(' '.repeat(indent.number) + 'completeWork', workInProgress);
    const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
        case HostRoot: // 代表原生节点
            bubbleProperties(workInProgress);
            break;
        case HostComponent: // 代表原生节点
            // todo: 现在只是在处理初次挂载新节点的逻辑，后面此处会进行区分是初次挂载还是更新
            // 创建真实的DOM节点
            const { type } = workInProgress;
            // 创建一个真实dom实例
            const instance = createInstance(type, newProps, workInProgress);
            // 把自己所有的儿子都添加到自己的身上(假设初次挂载)
            appendAllChildren(instance, workInProgress);
            workInProgress.stateNode = instance;
            finalizeInitialChildren(instance, type, newProps);
            bubbleProperties(workInProgress);
            break;
        case HostText: // 代表文本节点
            // 如果完成的fiber是文本节点，那就创建真实的文本节点
            const newText = newProps;
            // 创建真实的DOM节点并传入stateNode
            workInProgress.stateNode = createTextInstance(newText);
            // 向上冒泡属性
            bubbleProperties(workInProgress);
            break;
        default:
            break;
    }
}

function bubbleProperties(completedWork) {
    // flags:代表自己的副作用，subtreeFlags:代表儿子的副作用
    let subtreeFlags = NoFlags;
    // 遍历当前fiber的所有子节点，把所有的子节点的副作用，以及子节点的副作用全部合并
    let child = completedWork.child;
    while (child !== null) {
        subtreeFlags |= child.subtreeFlags;
        subtreeFlags |= child.flags;
        child = child.sibling;
    }
    completedWork.subtreeFlags = subtreeFlags;
}
