import ReactCurrentDispatcher from './ReactCurrentDispatcher';

function resolveDispatcher() {
    return ReactCurrentDispatcher.current;
}

/**
 *
 * @param {*} reducer reducer处理函数，用于根据老状态和动作计算新状态
 * @param {*} initialArg 初始状态
 */
export function useReducer(reducer, initialArg) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg);
}

export function useState(reducer, initialArg) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useState(reducer, initialArg);
}

export function useEffect(create, deps) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, deps);
}

export function useLayoutEffect(create, deps) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, deps);
}
