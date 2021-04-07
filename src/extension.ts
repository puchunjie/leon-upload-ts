import * as vscode from "vscode";
// import { exec } from 'child_process';
const proc = require('child_process').spawn('pbcopy');
import { handleImageToLeon, addImageUrlToEditor } from "./utils/upload";
import { DepNodeProvider, Dependency } from "./utils/leonBuckets";
import { computedViewUri } from "./utils/index";
import { imgTypes } from "./utils/fileTypes";
import { renderImg } from "./utils/render";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerTextEditorCommand(
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
  context.subscriptions.push(disposable);

  //边栏视图渲染
  const buckets = new DepNodeProvider();
  vscode.window.registerTreeDataProvider("leonMain", buckets);
  //文件点击预览
  let panel: any = null;
  vscode.commands.registerCommand(
    "leonMain.copyLink",
    (itemData: Dependency) => {
      const { bucketName, key } = itemData.ops;
      const imgUrl = computedViewUri(bucketName, key);
      proc.stdin.write(imgUrl); 
      proc.stdin.end();
      vscode.window.showInformationMessage('已复制到剪贴板。');
    }
  );

  vscode.commands.registerCommand("itemClick", (itemData: any) => {
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
    console.log(panel);
    // panel.title(key);
    const imgUrl = computedViewUri(bucketName, key);
    const imgTag = renderImg(imgUrl);
    panel.webview.html = `<html><body>${imgTag}</body></html>`;
  });
  //上传到指定文件夹
  vscode.commands.registerCommand(
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
      const localFile = uri[0].fsPath;
      const { isOk, msg, url } = await handleImageToLeon(localFile, {
        bucketName,
        key,
      });
      if (isOk) {
        buckets.refresh();
      } else {
        vscode.window.showErrorMessage(msg);
      }
    }
  );

  //新建文件夹
  // vscode.commands.registerCommand(
  //   "leonMain.addFloder",
  //   (itemData: Dependency) => {
  //     const { bucketName, key } = itemData.ops;
  //     console.log({ bucketName, key });
  //   }
  // );
}

export function deactivate() {}
