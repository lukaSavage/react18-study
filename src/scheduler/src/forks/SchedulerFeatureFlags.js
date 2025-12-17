
// React每一帧向浏览器申请5毫秒用于自己的任务执行
// 如果5ms内没有完成，React也会放弃控制权，把控制权交还给浏览器
export const frameYieldMs = 5;
