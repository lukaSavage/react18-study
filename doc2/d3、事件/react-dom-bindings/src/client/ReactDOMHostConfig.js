import { setInitialProperties } from './ReactDOMComponent';
import { precacheFiberNode, updateFiberProps } from './ReactDOMComponentTree';

export function shouldSetTextContent(type, props) {
    return typeof props.children === 'string' || typeof props.children === 'number';
}

export function createTextInstance(content) {
    return document.createTextNode(content);
}

/**
 * 创建真实节点
 * @param {*} type 真实节点对应的类型，如span、h1等
 * @param {*} newProps 要接收的属性
 * @param {*} internalInstanceHandle 当前对应的fiber节点
 * @returns
 */
export function createInstance(type, newProps, internalInstanceHandle) {
    const domElement = document.createElement(type);
    // todo: 属性的添加
    precacheFiberNode(internalInstanceHandle, domElement);
    // 让属性直接保存在domElement的属性上
    updateFiberProps(domElement, newProps);
    return domElement;
}

export function appendInitialChild(parent, child) {
    parent.appendChild(child);
}

export function finalizeInitialChildren(domElement, type, props, hostContext) {
    setInitialProperties(domElement, type, props);
}

/**
 *
 * @param {*} parentInstance 父DOM节点
 * @param {*} child 子DOM节点
 * @param {*} beforeChild 插入到谁的前面，它也是一个DOM节点
 */
export function insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild);
}

export function appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
}
