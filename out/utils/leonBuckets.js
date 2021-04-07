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
exports.Dependency = exports.DepNodeProvider = void 0;
const vscode = require("vscode");
const leonApi_1 = require("./leonApi");
const fileTypes_1 = require("./fileTypes");
class DepNodeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (element) {
                const { bucketName, key } = element.ops;
                const res = yield leonApi_1.getDataList(bucketName, key);
                if (res.code === 0 && res.result) {
                    const result = res.result.map((item) => {
                        const isFile = this.isFile(item.key);
                        return new Dependency({
                            bucketName,
                            key: `/${item.key}`,
                            contextValue: isFile ? "File" : "Floder",
                        }, item.key.replace(key.replace(/\//, ""), "").replace(/\//g, ""), item.key, isFile
                            ? vscode.TreeItemCollapsibleState.None
                            : vscode.TreeItemCollapsibleState.Collapsed);
                    });
                    return Promise.resolve(result);
                }
                else {
                    return Promise.resolve([]);
                }
            }
            else {
                const res = yield leonApi_1.getBuckets();
                if (res.code === 0 && res.result) {
                    const result = res.result.map((item) => {
                        return new Dependency({
                            bucketName: item.bucket_name,
                            key: "/",
                            contextValue: "Floder",
                        }, item.bucket_name, item.asset_key, vscode.TreeItemCollapsibleState.Collapsed);
                    });
                    return Promise.resolve(result);
                }
                else {
                    return Promise.resolve([]);
                }
            }
        });
    }
    isFile(fileName) {
        const ends = [...fileTypes_1.imgTypes, ...fileTypes_1.otherTypes];
        return ends.some((e) => fileName.includes(e));
    }
}
exports.DepNodeProvider = DepNodeProvider;
class Dependency extends vscode.TreeItem {
    constructor(ops, label, version, collapsibleState) {
        super(label, collapsibleState);
        this.ops = ops;
        this.label = label;
        this.version = version;
        this.collapsibleState = collapsibleState;
        this.command = {
            title: this.label,
            command: "itemClick",
            tooltip: this.label,
            arguments: [
                this.ops, // 目前这里我们只传递一个 label
            ],
        };
        this.contextValue = ops.contextValue;
    }
}
exports.Dependency = Dependency;
//# sourceMappingURL=leonBuckets.js.map