/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-27 14:58:55
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-05-31 22:07:13
 * @FilePath: \react18-study\src\main.jsx
 */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
// const element = (
//     <h1>
//         hello<span style={{ color: 'red' }}>world</span>
//     </h1>
// )

function reducer(state, action) {
    if (action.type === 'ADD') return state + action.payload;
    return state;
}
function FunctionComponent() {
    const [number, setNumber] = React.useReducer(reducer, 1111);
    const [number2, setNumber2] = React.useReducer(reducer, 2222);
    return <button onClick={() => {
        debugger
        setNumber({ type: 'add', payload: 1 })
        setNumber({ type: 'add', payload: 1 })
        setNumber({ type: 'add', payload: 1 })
    }}>{number}</button>;
    return (
        <h1
            onClick={e => console.log('onClick FunctionComponent')}
            onClickCapture={e => console.log('onClickCapture FunctionComponent')}
        >
            hello
            <span
                style={{ color: 'red' }}
                onClick={() => console.log('onClick span')}
                onClickCapture={() => console.log('onClickCapture span')}
            >
                world
            </span>
        </h1>
    );
}
const element = <FunctionComponent />;
console.log(element);

const root = createRoot(document.getElementById('root'));
console.log(root);
root.render(element);
