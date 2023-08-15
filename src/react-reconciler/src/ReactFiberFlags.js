/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-28 21:54:17
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-05-28 21:55:31
 * @FilePath: \react18-study\src\react-reconciler\src\ReactFiberFlags.js
 */
export const NoFlags = 0b00000000000000000000000000; // 0
export const Placement = 0b00000000000000000000000010; // 2
export const Update = 0b00000000000000000000000100; // 4
// 删除子节点
export const ChildDeletion = 0b00000000000000000000001000;  // 8
// 插入或者更新
export const MutationMask = Placement | Update | ChildDeletion;
// 如果函数组件的里面使用了useEffect, 那么此函数组价对应的fiber上会有一个flags 1024
export const Passive = 0b00000000000000010000000000; // 1024
export const LayoutMask = Update;
