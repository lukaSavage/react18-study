import { registerSimpleEvents, topLevelEventsToReactNames } from '../DOMEventProperties';
import { IS_CAPTURE_PHASE } from '../EventSystemFlags';
import { accumulateSinglePhaseListeners } from '../DOMPluginEventSystem';

function extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
) {
    const reactName = topLevelEventsToReactNames.get(domEventName);
    const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
    const listeners = accumulateSinglePhaseListeners(targetInst, reactName, nativeEvent.type, isCapturePhase);
    console.log(listeners);
}

export { registerSimpleEvents as registerEvents, extractEvents };