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
const path = require("path");
const proc = require("child_process").spawn("pbcopy");
const upload_1 = require("./utils/upload");
const leonBuckets_1 = require("./utils/leonBuckets");
const index_1 = require("./utils/index");
const fileTypes_1 = require("./utils/fileTypes");
const render_1 = require("./utils/render");
function activate(context) {
    //边栏视图渲染
    let buckets = new leonBuckets_1.DepNodeProvider();
    vscode.window.registerTreeDataProvider("leonMain", buckets);
    // 刷新边栏
    const refleshBuckets = vscode.commands.registerCommand("leonMain.refreshEntry", () => {
        buckets.refresh();
        vscode.window.showInformationMessage("列表已刷新。");
    });
    context.subscriptions.push(refleshBuckets);
    // 右键选择图片上传
    const rightUpload = vscode.commands.registerTextEditorCommand("leonupload.choosedImage", function () {
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
    context.subscriptions.push(rightUpload);
    // 点击复制链接
    const copyLink = vscode.commands.registerCommand("leonMain.copyLink", (itemData) => {
        const { bucketName, key } = itemData.ops;
        const imgUrl = index_1.computedViewUri(bucketName, key);
        if (process.platform === 'darwin') {
            proc.stdin.write(imgUrl);
            vscode.window.showInformationMessage("已复制到剪贴板。");
        }
        else {
            vscode.window.showErrorMessage('老铁，复制链接只实现了macOs版本！');
        }
    });
    context.subscriptions.push(copyLink);
    //文件点击预览
    let panel = null;
    const itemClick = vscode.commands.registerCommand("itemClick", (itemData) => {
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
    context.subscriptions.push(itemClick);
    //上传到指定文件夹
    const targetUpload = vscode.commands.registerCommand("leonMain.addFile", (itemData) => __awaiter(this, void 0, void 0, function* () {
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
    context.subscriptions.push(targetUpload);
    //新建文件夹
    const newFloder = vscode.commands.registerCommand("leonMain.addFloder", (itemData) => {
        const { bucketName, key } = itemData.ops;
        vscode.window
            .showInputBox({
            password: false,
            ignoreFocusOut: true,
            placeHolder: "文件夹名字",
        })
            .then((floderName) => __awaiter(this, void 0, void 0, function* () {
            if (!floderName) {
                return;
            }
            const leonPlaceholder = path.resolve(__dirname, "utils/leonPlaceholder.js");
            const { isOk } = yield upload_1.handleImageToLeon(leonPlaceholder, {
                bucketName,
                key: `${key}${floderName}/`,
            });
            if (isOk) {
                buckets.refresh();
            }
        }));
    });
    context.subscriptions.push(newFloder);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map