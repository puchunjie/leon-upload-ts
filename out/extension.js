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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// import { exec } from 'child_process';
const proc = require('child_process').spawn('pbcopy');
const upload_1 = require("./utils/upload");
const leonBuckets_1 = require("./utils/leonBuckets");
const index_1 = require("./utils/index");
const fileTypes_1 = require("./utils/fileTypes");
const render_1 = require("./utils/render");
function activate(context) {
    const disposable = vscode.commands.registerTextEditorCommand("leonupload.choosedImage", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = yield vscode.window.showOpenDialog({
                canSelectFolders: false,
                canSelectMany: false,
                filters: {
                    images: ["png", "jpg", "svg"],
                },
            });
            if (!uri) {
                return;
            }
            const localFile = uri[0].fsPath;
            const { isOk, msg, url } = yield upload_1.handleImageToLeon(localFile);
            if (isOk) {
                upload_1.addImageUrlToEditor(url);
            }
            else {
                vscode.window.showErrorMessage(msg);
            }
        });
    });
    context.subscriptions.push(disposable);
    //边栏视图渲染
    const buckets = new leonBuckets_1.DepNodeProvider();
    vscode.window.registerTreeDataProvider("leonMain", buckets);
    //文件点击预览
    let panel = null;
    vscode.commands.registerCommand("leonMain.copyLink", (itemData) => {
        const { bucketName, key } = itemData.ops;
        const imgUrl = index_1.computedViewUri(bucketName, key);
        proc.stdin.write(imgUrl);
        proc.stdin.end();
        vscode.window.showInformationMessage('已复制到剪贴板。');
    });
    vscode.commands.registerCommand("itemClick", (itemData) => {
        const { bucketName, key } = itemData;
        const isImg = fileTypes_1.imgTypes.some((e) => key.includes(e));
        if (!isImg) {
            return;
        }
        if (!panel) {
            panel = vscode.window.createWebviewPanel("webview", // viewType
            "预览", // 视图标题
            vscode.ViewColumn.One, // 显示在编辑器的哪个部位
            {
                enableScripts: false,
                retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
            });
        }
        console.log(panel);
        // panel.title(key);
        const imgUrl = index_1.computedViewUri(bucketName, key);
        const imgTag = render_1.renderImg(imgUrl);
        panel.webview.html = `<html><body>${imgTag}</body></html>`;
    });
    //上传到指定文件夹
    vscode.commands.registerCommand("leonMain.addFile", (itemData) => __awaiter(this, void 0, void 0, function* () {
        const { bucketName, key } = itemData.ops;
        const uri = yield vscode.window.showOpenDialog({
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                images: ["png", "jpg", "svg"],
            },
        });
        if (!uri) {
            return;
        }
        const localFile = uri[0].fsPath;
        const { isOk, msg, url } = yield upload_1.handleImageToLeon(localFile, {
            bucketName,
            key,
        });
        if (isOk) {
            buckets.refresh();
        }
        else {
            vscode.window.showErrorMessage(msg);
        }
    }));
    //新建文件夹
    // vscode.commands.registerCommand(
    //   "leonMain.addFloder",
    //   (itemData: Dependency) => {
    //     const { bucketName, key } = itemData.ops;
    //     console.log({ bucketName, key });
    //   }
    // );
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map