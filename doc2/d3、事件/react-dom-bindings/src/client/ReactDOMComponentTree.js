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

/**
 * 初始化的时候保存的真实dom属性(包含onClick等事件属性)
 * @param {*} node 
 * @param {*} props 
 */
export function updateFiberProps(node, props) {
    node[internalPropsKey] = props;
}

/**
 * 读取真实dom属性
 * @param {*} node 
 * @returns 
 */
export function getFiberCurrentPropsFromNode(node) {
    return node[internalPropsKey] || null;
}
