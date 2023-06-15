/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-28 21:06:42
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-03 17:23:04
 * @FilePath: \react18-study\src\react-reconciler\src\ReactFiber.js
 */
import { HostComponent, HostRoot, HostText, IndeterminateComponent } from './ReactWorkTags';
import { NoFlags } from './ReactFiberFlags';

/**
 *
 * @param {*} tag fiber的类型 函数组件0 类组件1 原生组件5 根元素3
 * @param {*} pendingProps 新属性，等待处理或者说生效的属性
 * @param {*} key 唯一标识
 */
export function FiberNode(tag, pendingProps, key) {
    this.tag = tag;
    this.key = key;
    this.type = null; // fiber类型，来自于虚拟DOM节点的type, span div p
    // 每个虚拟DOM => Fiber节点 => 真实DOM
    this.stateNode = null; // 此fiber对应的真实dom节点 h1 => 真实的h1 DOM

    this.return = null; // 指向父节点
    this.child = null; // 指向第一个子节点
    this.sibling = null; // 指向next弟弟节点

    // fiber哪来的？通过虚拟DOM节点创建，虚拟DOM会提供pendingProps用来创建fiber节点的属性
    this.pendingProps = pendingProps; // 等待生效的属性
    this.memoizedProps = null; // 已经生效的属性

    // 每个fiber还会有自己的状态，每一种fiber状态的类型是不一样的
    // 类组件对应的fiber存的就是类的实例的状态，HostRoot存的就是要渲染的元素
    this.memoizedState = null;

    // 每个fiber身上可能还有更新队列
    this.undateQueue = null;

    // 自身副作用的标识，表示要针对此fiber节点的进行何种操作
    this.flags = NoFlags; // 自己的副作用
    // 子节点对应的副作用使用标识，主要是为了提升性能(eg:如果副作用标识是0，那么后面的子节点就不用递归计算了)
    this.subtreeFlags = NoFlags;
    // 替身(相当于使用了双缓存技术或者说是预加载技术)
    this.alternate = null;
    // 默认索引值
    this.index = 0;
}

export function createFiber(tag, pendingProps, key) {
    return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber() {
    return createFiber(HostRoot);
}
