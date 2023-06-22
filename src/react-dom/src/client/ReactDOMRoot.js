/*
 * @Descripttion: 
 * @Author: lukasavage
 * @Date: 2023-05-28 15:55:21
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-01 21:59:19
 * @FilePath: \react18-study\src\react-dom\src\client\ReactDOMRoot.js
 */
import { createContainer, updateContainer } from 'react-reconciler/src/ReactFiberReconciler';

function ReactDOMRoot(internalRoot) {
    // 传入的internalRoot是FiberRootNode的一个实例
    this._internalRoot = internalRoot; // 所有的fiber信息都挂载在这个属性上
}

ReactDOMRoot.prototype.render = function(children) {
    const root = this._internalRoot;
    console.log(root);
    updateContainer(children, root);
}

export function createRoot(container) {
    // 这里的root即构造函数FiberRootNode的一个实例,相当于根Fiber
    // FiberRootNode里面有一个containerInfo属性，this.containerInfo ==> div#root
    const root = createContainer(container);
    // Fiber挂载到ReactDOMRoot的实例的一个属性_internalRoot上
    return new ReactDOMRoot(root);
}
