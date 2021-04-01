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
const upload_1 = require("./utils/upload");
const leonBuckets_1 = require("./utils/leonBuckets");
const index_1 = require("./utils/index");
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
    vscode.commands.registerCommand("leonMain.viewFile", (itemData) => {
        const { bucketName, key } = itemData.ops;
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(index_1.computedViewUri(bucketName, key)));
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
            key
        });
        if (isOk) {
            buckets.refresh();
        }
        else {
            vscode.window.showErrorMessage(msg);
        }
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map