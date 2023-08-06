import { setValueForStyles } from './CSSPropertyOperations';
import { setTextContent } from './setTextContent';
import { setValueForProperty } from './DOMPropertyOperations';

const STYLE = 'style';
const CHILDREN = 'children';

export function setInitialDOMProperties(tag, domElement, nextProps) {
    for (const propKey in nextProps) {
        if (nextProps.hasOwnProperty(propKey)) {
            const nextProp = nextProps[propKey];
            if (propKey === STYLE) {
                setValueForStyles(domElement, nextProp);
            } else if (propKey === CHILDREN) {
                if (typeof nextProp === 'string') {
                    setTextContent(domElement, nextProp);
                } else if (typeof nextProp === 'number') {
                    // 如果是数字，将之变为字符串
                    setTextContent(domElement, `${nextProp}`);
                }
            } else if (nextProp !== null) {
                setValueForProperty(domElement, propKey, nextProp);
            }
        }
    }
}

export function setInitialProperties(domElement, tag, props) {
    setInitialDOMProperties(tag, domElement, props);
}

export function diffProperties(domElement, tag, lastProps, nextProps) {
    let updatePayload = null;
    let propKey;
    let styleName;
    let styleUpdates = null;

    // 处理属性的删除 如果说一个属性在老对象有，新对象没有的话，那就意味着删除
    for (propKey in lastProps) {
        // 如果新属性对象里面有此属性，或者老的没有此属性，或者老的是个null
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] === null) {
            continue;
        }
        if (propKey === STYLE) {
            const lastStyle = lastProps[propKey];
            for (styleName in lastStyle) {
                if (lastStyle.hasOwnProperty(styleName)) {
                    if (!styleUpdates) {
                        styleUpdates = {};
                    }
                    styleUpdates[styleName] = '';
                }
            }
        } else {
            (updatePayload = updatePayload || []).push(propKey, null);
        }
    }
    // 遍历新的属性对象
    for (propKey in nextProps) {
        const nextProp = nextProps[propKey]; // 新属性中的值
        const lastProp = lastProps !== null ? lastProps[propKey] : undefined; // 老属性中的值
        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp === null && lastProp === null)) {
            continue;
        }
        if (propKey === STYLE) {
            if (lastProp) {
                // 计算要删除的行内样式
                for (styleName in lastProp) {
                    // 如果此样式对象里在的某个属性老的style里面有，新的style里面没有
                    if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                        if (!styleUpdates) styleUpdates = {};
                        styleUpdates[styleName] = '';
                    }
                }
                for (styleName in nextProp) {
                    if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                        if (!styleUpdates) styleUpdates = {};
                        styleUpdates[styleName] = nextProp[styleName];
                    }
                }
            } else {
                styleUpdates = nextProp;
            }
        } else if (propKey === CHILDREN) {
            if (typeof nextProp === 'string' || typeof nextProp === 'number') {
                (updatePayload = updatePayload || []).push(propKey, nextProp);
            }
        } else {
            (updatePayload = updatePayload || []).push(propKey, nextProp);
        }
    }

    console.log('updatePayload---------------', updatePayload);

    if (styleUpdates) {
        (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
    }
    return updatePayload; // [key1, value1, key2, value2]
}

export function updateProperties(domElement, updatePayload) {
    updateDOMProperties(domElement, updatePayload);
}

function updateDOMProperties(domElement, updatePayload) {
    for (let i = 0; i < updatePayload.length; i += 2) {
        const propKey = updatePayload[i];
        const propValue = updatePayload[i + 1];
        if (propKey === STYLE) {
            setValueForStyles(domElement, propValue);
        } else if (propKey === CHILDREN) {
            setTextContent(domElement, propValue);
        } else {
            setValueForProperty(domElement, propKey, propValue);
        }
    }
}
