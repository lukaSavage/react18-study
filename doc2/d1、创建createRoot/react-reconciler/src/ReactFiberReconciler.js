/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-28 15:59:58
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-03 16:35:46
 * @FilePath: \react18-study\src\react-reconciler\src\ReactFiberReconciler.js
 */
import { createFiberRoot } from './ReactFiberRoot';

export function createContainer(containerInfo) {
    return createFiberRoot(containerInfo);
}
