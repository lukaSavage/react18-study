import { createHostRootFiber } from './ReactFiber';
import { initialUpdateQueue } from './ReactFiberClassUpdateQueue';

function FiberRootNode(containerInfo) {
    this.containerInfo = containerInfo; // containerInfo ==> div#root
}
export function createFiberRoot(containerInfo) {
    // containerInfo ==> div#root
    const root = new FiberRootNode(containerInfo);
    // HostRoot指的就是根节点div#root,HostRootFiber代表根Fiber
    const uninitializedFiber = createHostRootFiber();
    // 根容器的current指向当前的根容器(根fiber)现在正在显示或者已经渲染好的fiber树
    root.current = uninitializedFiber;
    // 根fiber的stateNode,也就是真实dom节点指向FiberRootNode
    uninitializedFiber.stateNode = root;

    // 开始初始化更新队列
    initialUpdateQueue(uninitializedFiber);
    return root;
}
