/*
 * @Descripttion: 
 * @Author: lukasavage
 * @Date: 2023-05-28 12:01:30
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-05-28 14:02:07
 * @FilePath: \react18-study\src\react\src\jsx\ReactJSXElement.js
 */
import hasOwnProperty from 'shared/hasOwnProperty';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';

const RESERVED_PROPS = {
    // 保留的属性，不会放到props上
    key: true,
    ref: true,
    __self: true,
    __source: true,
};
function hasValidKey(config) {
    return config.key !== undefined;
}
function hasValidRef(config) {
    return config.ref !== undefined;
}
function ReactElement(type, key, ref, props) {
    return {
        // 返回的就是React元素，也被称之为虚拟DOM
        $$typeof: REACT_ELEMENT_TYPE,
        type, // 一些常用html标签，如h1 span
        key, // 唯一标识
        ref, // 后面用于获取真实dom元素的
        props, // 属性，children, style, id
    };
}
export function jsxDEV(type, config) {
    let propName; // 属性名
    const props = {}; // 属性对象
    let key = null; // 每个虚拟dom可以有个可选的key属性，用来区分一个父节点下的不同子节点
    let ref = null; // 引入，后面可以通过这实现获取真实dom的需求
    if (hasValidKey(config)) {
        key = config.key;
    }
    if (hasValidRef(config)) {
        ref = config.ref;
    }
    for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            // 如果当前属性是object自身的属性时
            props[propName] = config[propName]; // 把config上的属性拷贝到props上
        }
    }

    return ReactElement(type, key, ref, props);
}
