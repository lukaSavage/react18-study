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
    const [number, setNumber] = React.useState(0);
    // const [number, setNumber] = React.useReducer(reducer, 1111);
    const [number2, setNumber2] = React.useState(2222);
    return number === 0 ? (
        <ul key='container' onClick={() => setNumber(number + 1)}>
            <li key='A'>A</li>
            <li key='B' id='b'>
                B
            </li>
            <li key='C'>C</li>
            <li key='D'>D</li>
            <li key='E'>E</li>
            <li key='F'>F</li>
        </ul>
    ) : (
        <ul key='container' onClick={() => setNumber(number + 1)}>
            <li key='A'>A2</li>
            <li key='C'>C2</li>
            <li key='E'>E2</li>
            <li key='B' id='b2'>
                B2
            </li>
            <li key='G'>G</li>
            <li key='D'>D2</li>
        </ul>
    );
    return (
        <button
            id={Date.now()}
            onClick={() => {
                // setNumber({ type: 'ADD', payload: 3 });
                // setNumber({ type: 'ADD', payload: 2 });
                // setNumber({ type: 'ADD', payload: 1 });
                console.log(number2);
                setNumber2(number2 + 1);
                console.log('111', number2);
                setNumber2(number2 + 2);
                console.log('222', number2);
            }}
        >
            {/* {number} */}
            {number2}
        </button>
    );
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
