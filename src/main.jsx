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
    React.useEffect(() => {
        console.log('useEffect1');
        return () => {
            console.log('destroy useEffect1');
        };
    });
    React.useEffect(() => {
        console.log('useEffect2');
        return () => {
            console.log('destroy useEffect2');
        };
    });
    React.useEffect(() => {
        console.log('useEffect3');
        return () => {
            console.log('destroy useEffect3');
        };
    });
    return <button onClick={() => setNumber(number + 1)}>{number}</button>;
}
const element = <FunctionComponent />;
console.log(element);

const root = createRoot(document.getElementById('root'));
console.log(root);
root.render(element);
