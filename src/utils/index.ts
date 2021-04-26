const { spawn, exec } = require("child_process");
const https = require("https");

import * as vscode from "vscode";
export const computedViewUri = (
  bucketName: string,
  key: string,
  folder?: string
) => {
  return folder
    ? `https://file.40017.cn/${bucketName}${folder}${key}`
    : `https://file.40017.cn/${bucketName}${key}`;
};

export const ITEM_ICON_MAP = new Map<string, string>([
  ["Bucket", "bucket.svg"],
  ["Floder", "floder.svg"],
  ["Img", "img.svg"],
  ["js", "js.svg"],
  ["css", "css.svg"],
  ["zip", "zip.svg"],
  ["text", "text.svg"],
  ["md", "md.svg"],
  ["mp3", "mp3.svg"],
  ["mp4", "mp4.svg"],
  ["text", "text.svg"],
  ["html", "html.svg"],
  ["unknow", "unknow.svg"],
]);

export const copyResouce = (url: string, msg?: string) => {
  try {
    if (process.platform === "darwin") {
      exec(`echo ${url} | pbcopy`);
    } else {
      spawn("cmd.exe", ["/s", "/c", `echo ${url}| clip`]);
    }
    if (msg) {
      vscode.window.showInformationMessage(msg);
    }
  } catch (error) {
    vscode.window.showErrorMessage(error);
  }
};

// 测试资源是否已存在
export const testResourcesExistence = (onLineUrl: string) => {
  return new Promise((resove, reject) => {
    try {
      https.get(onLineUrl, (res: any) => {
        resove(res.statusCode === 200);
      });
    } catch (err) {
      reject(err);
    }
  });
};
