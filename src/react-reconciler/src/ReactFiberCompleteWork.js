import logger, { indent } from 'react-dom-bindings/logger';

export function completeWork(current, workInProgress) {
    indent.number -=2;
    logger(" ".repeat(indent.number) + 'completeWork', workInProgress);
}
