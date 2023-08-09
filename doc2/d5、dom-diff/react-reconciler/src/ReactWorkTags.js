/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-28 21:08:44
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-03 17:41:01
 * @FilePath: \react18-study\src\react-reconciler\src\ReactWorkTags.js
 */
// 根Fiber的tag
// 每种虚拟DOM都会对应自己的fiber tag类型

export const FunctionComponent = 0; // 函数组件
export const ClassComponent = 1; // 类组件
export const IndeterminateComponent = 2; // 未决定的组件类型(后面我们会讲到函数组件和类组件)
export const HostRoot = 3; // 容器根节点
export const HostComponent = 5; // 原生节点 span div
export const HostText = 6; // 纯文本节点
