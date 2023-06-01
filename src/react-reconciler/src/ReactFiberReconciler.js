/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-28 15:59:58
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-01 22:08:47
 * @FilePath: \react18-study\src\react-reconciler\src\ReactFiberReconciler.js
 */
import { createFiberRoot } from './ReactFiberRoot';
import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue'
export function createContainer(containerInfo) {
    return createFiberRoot(containerInfo);
}

/** 更新容器，把虚拟dom element变成真实DOM插入到container的容器中
 * render方法必调用的函数
 * @param {*} element 要插入的虚拟DOM
 * @param {*} container this._internalRoot DOM容器 FiberRootNode containerInfo div#root
 */
export function updateContainer(element, container) {
    // 获取当前的根fiber
    const current = container.current;
    // 创建更新
    const update = createUpdate();
    // 要更新的虚拟DOM
    update.payload = { element };
    // 把此更新对象添加到current这个根Fiber的更新队列上去
    enqueueUpdate(current, update);
}
