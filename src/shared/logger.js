import * as ReactWorkTags from 'react-reconciler/src/ReactWorkTags'

const ReactWorkTagsMap = new Map();
for (const tag in ReactWorkTagsMap) {
    ReactWorkTagsMap.set(ReactWorkTags[tag], tag);
}

export default function(prefix, workInProgress) {
    let tagValue = workInProgress.tag;
    let tagName = ReactWorkTagsMap.get(tagValue);
    let str = ` ${tagName} `;
    if(tagName === 'hostComponent') {
        str + `${workInProgress.type}`;
    } else if(tagName === 'HostText') {
        str + ` ${workInProgress.pendingProps} `;
    }
    console.log(`${prefix} ${str}`);
    return str;
}