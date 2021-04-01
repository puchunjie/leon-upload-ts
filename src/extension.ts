import * as vscode from "vscode";
import { handleImageToLeon, addImageUrlToEditor } from "./utils/upload";
import { DepNodeProvider, Dependency } from "./utils/leonBuckets";
import { computedViewUri } from "./utils/index";

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
  vscode.commands.registerCommand(
    "leonMain.viewFile",
    (itemData: Dependency) => {
      const { bucketName, key } = itemData.ops;
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(computedViewUri(bucketName, key))
      );
    }
  );
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
		key
	  });
	  if (isOk) {
		buckets.refresh();
	  } else {
		vscode.window.showErrorMessage(msg);
	  }
    }
  );
}

export function deactivate() {}
