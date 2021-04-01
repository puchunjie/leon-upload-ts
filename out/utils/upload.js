"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImageUrlToEditor = exports.handleImageToLeon = void 0;
const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const vscode = require("vscode");
const getLeonSetting_1 = require("./getLeonSetting");
const index_1 = require("./index");
const boundary = "----WebKitFormBoundaryAGJoBU0nvDkk5Xb0";
const handleImageToLeon = (localFile, ops) => __awaiter(void 0, void 0, void 0, function* () {
    let { apiUrl, userToken, assetKey, bucketName, folder } = getLeonSetting_1.default || {};
    if (ops) {
        bucketName = ops.bucketName;
        folder = ops.key;
    }
    try {
        return new Promise((resolve, reject) => {
            if (!apiUrl || !userToken || !assetKey || !bucketName) {
                resolve({
                    isOk: false,
                    msg: "请前往setting对狮子座上传插件进行配置！",
                });
            }
            const URL = url.parse(apiUrl);
            const options = {
                method: "POST",
                hostname: URL.hostname,
                path: URL.path,
                headers: {
                    "content-type": "multipart/form-data; boundary=" + boundary,
                    "user-token": userToken,
                    "asset-key": assetKey,
                },
            };
            let filename = path.basename(localFile);
            let extname = path.extname(localFile);
            if (extname === ".map") {
                filename = "-" + filename;
            }
            let mime = getMime(extname);
            let request = http.request(options, function (res) {
                let chunks = [];
                res.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                res.on("end", () => {
                    let body = Buffer.concat(chunks);
                    let jsonRes;
                    try {
                        jsonRes = JSON.parse(body.toString());
                        // 成功后 组装一个在线地址返回回去
                        if (jsonRes.code === 0) {
                            resolve({
                                isOk: true,
                                url: index_1.computedViewUri(bucketName, filename, folder),
                            });
                        }
                        else {
                            resolve({
                                isOk: false,
                                msg: "狮子座上传失败：" + (jsonRes.msg || ""),
                            });
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                });
                res.on("error", (e) => {
                    // console.log("error", e);
                    reject(e);
                });
            });
            request.on("error", function (e) {
                reject(e);
            });
            let fileStream = fs.createReadStream(localFile);
            request.write(`--${boundary}\r\nContent-Disposition: form-data; name="bucket_name"\r\n\r\n${bucketName}\r\n--${boundary}\r\nContent-Disposition: form-data; name="key"\r\n\r\n${folder}\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`);
            fileStream.pipe(request, { end: false });
            fileStream.on("end", () => {
                // console.log("end", "--------------------------")
                request.end(`\r\n--${boundary}--`);
            });
            fileStream.on("error", (e) => {
                // console.log(e);
                reject(e);
            });
        });
    }
    catch (error) {
        const message = error.message ? error.message : error;
        vscode.window.showErrorMessage(message);
    }
});
exports.handleImageToLeon = handleImageToLeon;
function getMime(extname) {
    let mime = new Map();
    mime.set(".css", "text/css");
    mime.set(".png", "image/png");
    mime.set(".gif", "image/gif");
    mime.set(".js", "application/javascript");
    mime.set(".pdf", "application/pdf");
    mime.set(".jpg", "image/jpeg");
    mime.set(".svg", "image/svg+xml");
    mime.set(".map", "text/plain");
    let res = "application/octet-stream";
    if (mime.get(extname)) {
        res = mime.get(extname);
    }
    return res;
}
const addImageUrlToEditor = (url) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    // 替换内容
    const selection = editor.selection;
    editor.edit((editBuilder) => {
        editBuilder.replace(selection, url);
    });
};
exports.addImageUrlToEditor = addImageUrlToEditor;
//# sourceMappingURL=upload.js.map