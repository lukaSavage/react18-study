/*
 * @Descripttion: 深度优先和广度优先借号
 * @Author: lukasavage
 * @Date: 2023-06-01 21:24:21
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-06-01 21:38:09
 * @FilePath: \react18-study\doc\06、深度优先和广度优先.js
 */

/* 
深度优先搜索英文缩写为 DFS 即Depth First Search
其过程简要来说是对每一个可能的分支路径深入到不能再深入为止，而且每个节点只能访问一次
应用场景
React 虚拟 DOM 的构建
React 的 fiber 树构建

*/

function dfs(node) {
    console.log(node.name);
    node.children &&
        node.children?.forEach(child => {
            dfs(child);
        });
}
let root = {
    name: 'A',
    children: [
        {
            name: 'B',
            children: [{ name: 'B1' }, { name: 'B2' }],
        },
        {
            name: 'C',
            children: [{ name: 'C1' }, { name: 'C2' }],
        },
    ],
};
dfs(root);

/* 
宽度优先搜索算法（又称广度优先搜索），BFS 其英文全称是 Breadth First Search
算法首先搜索距离为k的所有顶点，然后再去搜索距离为k+l的其他顶点
*/
function bfs(node) {
    const stack = [];
    stack.push(node);
    let current;
    while ((current = stack.shift())) {
        console.log(current.name);
        current.children &&
            current.children.forEach(child => {
                stack.push(child);
            });
    }
}
let root2 = {
    name: 'A',
    children: [
        {
            name: 'B',
            children: [{ name: 'B1' }, { name: 'B2' }],
        },
        {
            name: 'C',
            children: [{ name: 'C1' }, { name: 'C2' }],
        },
    ],
};
// bfs(root);
