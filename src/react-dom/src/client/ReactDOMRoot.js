/*
 * @Descripttion: 
 * @Author: lukasavage
 * @Date: 2023-05-28 15:55:21
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-05-29 21:03:51
 * @FilePath: \react18-study\src\react-dom\src\client\ReactDOMRoot.js
 */
import { createContainer } from 'react-reconciler/src/ReactFiberReconciler';

function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot; // 所有的fiber信息都挂载在这个属性上
}

export function createRoot(container) {
    // div#root
    const root = createContainer(container);
    return new ReactDOMRoot(root);
}
