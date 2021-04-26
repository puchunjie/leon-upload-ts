"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testResourcesExistence = exports.copyResouce = exports.ITEM_ICON_MAP = exports.computedViewUri = void 0;
const { spawn, exec } = require("child_process");
const https = require("https");
const vscode = require("vscode");
const computedViewUri = (bucketName, key, folder) => {
    return folder
        ? `https://file.40017.cn/${bucketName}${folder}${key}`
        : `https://file.40017.cn/${bucketName}${key}`;
};
exports.computedViewUri = computedViewUri;
exports.ITEM_ICON_MAP = new Map([
    ["Bucket", "bucket.svg"],
    ["Floder", "floder.svg"],
    ["Img", "img.svg"],
    ["js", "js.svg"],
    ["css", "css.svg"],
    ["zip", "zip.svg"],
    ["text", "text.svg"],
    ["md", "md.svg"],
    ["mp3", "mp3.svg"],
    ["mp4", "mp4.svg"],
    ["text", "text.svg"],
    ["html", "html.svg"],
    ["unknow", "unknow.svg"],
]);
const copyResouce = (url, msg) => {
    try {
        if (process.platform === "darwin") {
            exec(`echo ${url} | pbcopy`);
        }
        else {
            spawn("cmd.exe", ["/s", "/c", `echo ${url}| clip`]);
        }
        if (msg) {
            vscode.window.showInformationMessage(msg);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(error);
    }
};
exports.copyResouce = copyResouce;
// 测试资源是否已存在
const testResourcesExistence = (onLineUrl) => {
    return new Promise((resove, reject) => {
        try {
            https.get(onLineUrl, (res) => {
                resove(res.statusCode === 200);
            });
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.testResourcesExistence = testResourcesExistence;
//# sourceMappingURL=index.js.map