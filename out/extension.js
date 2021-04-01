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
function activate(context) {
    const disposable = vscode.commands.registerTextEditorCommand("leonupload.choosedImage", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = yield vscode.window.showOpenDialog({
                canSelectFolders: false,
                canSelectMany: false,
                filters: {
                    images: ["png", "jpg"],
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
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map