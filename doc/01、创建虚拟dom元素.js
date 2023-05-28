// 在react 17之前，babel转换是老的写法
const babel = require('@babel/core');
const sourceCode = `
    <h1>
        hello<span style={{ color: "red" }}>world</span>
    </h1>
`;
// runtime: classic 老版本写法  automatic: 新版本写法
const result = babel.transform(sourceCode, {
    plugins: [['@babel/plugin-transform-react-jsx', { runtime: 'classic' }]],
});

console.log(result.code);

// 老版本转换后的代码
// React.createElement(
//     'h1',
//     null,
//     'hello',
//     /*#__PURE__*/ React.createElement(
//         'span',
//         {
//             style: {
//                 color: 'red',
//             },
//         },
//         'world'
//     )
// );

// 新版本转换后的代码

// import { jsx as _jsx } from "react/jsx-runtime";
// import { jsxs as _jsxs } from "react/jsx-runtime";
// /*#__PURE__*/_jsxs("h1", {
//   children: ["hello", /*#__PURE__*/_jsx("span", {
//     style: {
//       color: "red"
//     },
//     children: "world"
//   })]
// });

/* 
总结：
    ①、老版本的转换传递的参数有所不同，它的属性作为一个单独的参数传递，而新版本这是放入一个对象里面，属性和children都在里面


*/