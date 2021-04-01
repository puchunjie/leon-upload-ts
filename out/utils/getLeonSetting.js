"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const leonConfig = vscode.workspace.getConfiguration("leon_upload_image");
exports.default = {
    bucketName: leonConfig.bucket,
    apiUrl: leonConfig.domain,
    userToken: leonConfig.userToken,
    assetKey: leonConfig.accessKey,
    folder: leonConfig.folder || "/",
};
//# sourceMappingURL=getLeonSetting.js.map