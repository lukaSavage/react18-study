import { HostRoot } from "./ReactWorkTags";

/**
 * 本来此方法要处理更新优先级的问题
 * 我们目前只实现向上找到根节点的问题
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
    let node = sourceFiber; // 当前fiber
    let parent = sourceFiber.return; // 当期fiber父fiber
    while(parent !== null) {
        node = parent;
        parent = parent.return;
    }
    // 一直回溯到根fiber
    if(node.tag === HostRoot) {
        // 直接返回FiberRootNode
        return node.stateNode;
    }
    // 出错了返回null(基本不可能~)
    return null;
}