import * as vscode from "vscode";
const path = require("path");
import { handleImageToLeon, addImageUrlToEditor } from "./utils/upload";
import { DepNodeProvider, Dependency } from "./utils/leonBuckets";
import { computedViewUri, copyResouce, testResourcesExistence } from "./utils/index";
import { imgTypes } from "./utils/fileTypes";
import { renderImg } from "./utils/render";

export function activate(context: vscode.ExtensionContext) {
  //边栏视图渲染
  let buckets = new DepNodeProvider();
  vscode.window.registerTreeDataProvider("leonMain", buckets);

  // 刷新边栏
  const refleshBuckets = vscode.commands.registerCommand(
    "leonMain.refreshEntry",
    () => {
      buckets.refresh();
      vscode.window.showInformationMessage("列表已刷新。");
    }
  );
  context.subscriptions.push(refleshBuckets);

  // 右键选择图片上传
  const choiseUpload = vscode.commands.registerTextEditorCommand(
    "leonupload.choosedImage",
    async function () {
      const uri = await vscode.window.showOpenDialog({
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
      const { isOk, msg, url } = await handleImageToLeon(localFile);
      if (isOk) {
        addImageUrlToEditor(url);
      } else {
        vscode.window.showErrorMessage(msg);
      }
    }
  );
  context.subscriptions.push(choiseUpload);

  // 右键直接上传资源
  const rightUpload = vscode.commands.registerTextEditorCommand(
    "leonupload.uploadThis",
    async (itemData: vscode.TextEditor) => {
      console.log(path.resolve(itemData.document.fileName));
      const localFile = path.resolve(itemData.document.fileName);
      const { isOk, msg, url } = await handleImageToLeon(localFile);
      console.log({ isOk, msg, url });
      if (isOk) {
        copyResouce(url, '上传成功，已复制资源链接到剪贴板。');
      } else {
        vscode.window.showErrorMessage(msg);
      }
    }
  );
  context.subscriptions.push(rightUpload);

  // 点击复制链接
  const copyLink = vscode.commands.registerCommand(
    "leonMain.copyLink",
    (itemData: Dependency) => {
      const { bucketName, key } = itemData.ops;
      const imgUrl = computedViewUri(bucketName, key);
      copyResouce(imgUrl, '已复制到剪贴板');
    }
  );
  context.subscriptions.push(copyLink);

  //文件点击预览
  let panel: any = null;
  const itemClick = vscode.commands.registerCommand(
    "itemClick",
    (itemData: any) => {
      const { bucketName, key } = itemData;
      const isImg = imgTypes.some((e) => key.includes(e));
      if (!isImg) {
        return;
      }
      if (!panel) {
        panel = vscode.window.createWebviewPanel(
          "webview", // viewType
          "预览", // 视图标题
          vscode.ViewColumn.One, // 显示在编辑器的哪个部位
          {
            enableScripts: false, // 启用JS，默认禁用
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
          }
        );
      }
      const imgUrl = computedViewUri(bucketName, key);
      const imgTag = renderImg(imgUrl);
      panel.webview.html = `<html><body>${imgTag}</body></html>`;
    }
  );
  context.subscriptions.push(itemClick);

  //上传到指定文件夹
  const targetUpload = vscode.commands.registerCommand(
    "leonMain.addFile",
    async (itemData: Dependency) => {
      const { bucketName, key } = itemData.ops;
      const uri = await vscode.window.showOpenDialog({
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
          images: ["png", "jpg", "svg"],
        },
      });
      if (!uri) {
        return;
      }
      const { fsPath: localFile, path: localFilePath } = uri[0];
      
      // 校验资源是否存在
      const fileSplit = localFilePath.split('/');
      const fileName = fileSplit[fileSplit.length - 1];
      const onLineUrl = computedViewUri(bucketName, fileName, key);
      const fileExistence = await testResourcesExistence(onLineUrl);
      if (fileExistence) {
        copyResouce(onLineUrl);
        vscode.window.showErrorMessage('资源已存在, 资源路径已复制到剪贴板！');
        return;
      }
      const { isOk, msg, url } = await handleImageToLeon(localFile, {
        bucketName,
        key,
      });
      if (isOk) {
        buckets.refresh();
        copyResouce(url, '资源已上传，资源路径已复制到剪贴板！');
      } else {
        vscode.window.showErrorMessage(msg);
      }
    }
  );
  context.subscriptions.push(targetUpload);

  //新建文件夹
  const newFloder = vscode.commands.registerCommand(
    "leonMain.addFloder",
    (itemData: Dependency) => {
      const { bucketName, key } = itemData.ops;
      vscode.window
        .showInputBox({
          password: false,
          ignoreFocusOut: true,
          placeHolder: "文件夹名字",
        })
        .then(async (floderName) => {
          if (!floderName) {
            return;
          }
          const leonPlaceholder = path.resolve(
            __dirname,
            "utils/leonPlaceholder.js"
          );
          const { isOk } = await handleImageToLeon(leonPlaceholder, {
            bucketName,
            key: `${key}${floderName}/`,
          });
          if (isOk) {
            buckets.refresh();
          }
        });
    }
  );
  context.subscriptions.push(newFloder);
}

export function deactivate() {}
