const randomKey = Math.random().toString(36).slice(2);
const internalInstanceKey = '__reactFiber$' + randomKey;
const internalPropsKey = '__reactProps$' + randomKey;
/**
 * 从真实的DOM节点上获取它对应的fiber节点
 * @param {*} targetNode 真实DOM节点
 */
export function getClosestInstanceFromNode(targetNode) {
    const targetInst = targetNode[internalInstanceKey];
    return targetInst;
}

/**
 * 提前缓存fiber节点的实例到DOM节点上
 * @param {*} hostInst 当前的fiber节点
 * @param {*} node 原生真实节点
 */
export function precacheFiberNode(hostInst, node) {
    node[internalInstanceKey] = hostInst;
}

export function updateFiberProps(node, props) {
    node[internalPropsKey] = props;
}

export function getFiberCurrentPropsFromNode(node) {
    return node[internalPropsKey] || null;
}
