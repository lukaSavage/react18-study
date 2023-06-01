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
    this._internalRoot = internalRoot; // 所有的fiber信息都挂载在这个属性上
}

ReactDOMRoot.prototype.render = function(children) {
    const root = this._internalRoot;
    updateContainer(children, root);
}

export function createRoot(container) {
    // div#root
    const root = createContainer(container);
    return new ReactDOMRoot(root);
}
