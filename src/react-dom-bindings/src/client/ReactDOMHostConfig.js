import { setInitialProperties } from './ReactDOMComponent';

export function shouldSetTextContent(type, props) {
    return typeof props.children === 'string' || typeof props.children === 'number';
}

export function createTextInstance(content) {
    return document.createTextNode(content);
}

export function createInstance(type) {
    const domElement = document.createElement(type);
    // todo: 属性的添加
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
