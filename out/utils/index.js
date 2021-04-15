"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEM_ICON_MAP = exports.computedViewUri = void 0;
const computedViewUri = (bucketName, key, folder) => {
    return folder ? `https://file.40017.cn/${bucketName}${folder}${key}` : `https://file.40017.cn/${bucketName}${key}`;
};
exports.computedViewUri = computedViewUri;
exports.ITEM_ICON_MAP = new Map([
    ['folder', 'floder.svg']
]);
//# sourceMappingURL=index.js.map