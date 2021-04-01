import * as vscode from "vscode";
const leonConfig = vscode.workspace.getConfiguration("leon_upload_image");

export default {
  bucketName: leonConfig.bucket,
  apiUrl: leonConfig.domain,
  userToken: leonConfig.userToken,
  assetKey: leonConfig.accessKey,
  folder: leonConfig.folder || "/",
};
