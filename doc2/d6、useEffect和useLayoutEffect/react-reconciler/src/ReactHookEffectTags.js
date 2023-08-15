export const NoFlags = 0b0000;
// 代表有effect, 只有有此flag才会执行effect
export const HasEffect = 0b0001;
export const Insertion = 0b0010;
// 代表是useLayoutEffect
export const Layout = 0b0100;
// 代表是useEffect
export const Passive = 0b1000;

