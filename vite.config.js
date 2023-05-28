/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2023-05-27 14:44:38
 * @LastEditors: lukasavage
 * @LastEditTime: 2023-05-28 13:07:01
 * @FilePath: \react18-study\vite.config.js
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            react: path.posix.resolve('src/react'),
            'react-dom': path.posix.resolve('src/react-dom'),
            'react-dom-bindings': path.posix.resolve('src/react-dom-bindings'),
            'react-reconciler': path.posix.resolve('src/react-reconciler'),
            scheduler: path.posix.resolve('src/scheduler'),
            shared: path.posix.resolve('src/shared'),
        },
    },
    plugins: [react()],
});

/* 
    解释下path.posix
    window 和 linux路径分隔符不一样  window 用 "\", linux用"/"
    为了解决上面的兼容性，所以用火山了path.posix
*/