/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-27 14:58:55
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-05-31 22:07:13
 * @FilePath: \react18-study\src\main.jsx
 */
import { createRoot } from 'react-dom/client';
// const element = (
//     <h1>
//         hello<span style={{ color: 'red' }}>world</span>
//     </h1>
// )
function FunctionComponent() {
    return (
        <h1
            onClick={(e) => console.log('onClick FunctionComponent')}
            onClickCapture={(e) => console.log('onClickCapture FunctionComponent')}
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
