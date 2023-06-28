/*
 * @Descripttion: 
 * @Author: lukasavage
 * @Date: 2023-05-28 21:54:17
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-05-28 21:55:31
 * @FilePath: \react18-study\src\react-reconciler\src\ReactFiberFlags.js
 */
export const NoFlags = 0b00000000000000000000000000;
export const Placement = 0b00000000000000000000000010;
export const Update = 0b00000000000000000000000100;
// 删除子节点
export const ChildDeletion = 0b00000000000000000000001000;
// 插入或者更新
export const MutationMask = Placement | Update; 