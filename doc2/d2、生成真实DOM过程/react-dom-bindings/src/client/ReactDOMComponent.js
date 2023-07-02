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
                setValueForProperty(domElement, nextProp);
            }
        }
    }
}

export function setInitialProperties(domElement, tag, props) {
    setInitialDOMProperties(tag, domElement, props);
}
