"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const leonConfig = vscode.workspace.getConfiguration("leon_upload_image");
exports.default = {
    bucketName: leonConfig.bucket,
    apiUrl: leonConfig.domain || 'http://leonidapi.17usoft.com/libraapi2/leonid/v2/static/object',
    userToken: leonConfig.userToken,
    assetKey: leonConfig.accessKey,
    folder: leonConfig.folder || "/",
};
//# sourceMappingURL=getLeonSetting.js.map