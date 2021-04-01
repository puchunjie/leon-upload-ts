import * as vscode from 'vscode';
import { handleImageToLeon, addImageUrlToEditor } from './utils/upload';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerTextEditorCommand(
		"leonupload.choosedImage",
		async function () {
		  const uri = await vscode.window.showOpenDialog({
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
		  const { isOk, msg, url } = await handleImageToLeon(localFile);
		  if (isOk) {
			addImageUrlToEditor(url);
		  } else {
			vscode.window.showErrorMessage(msg);
		  }
		}
	  );
	  context.subscriptions.push(disposable);
}


export function deactivate() {}
