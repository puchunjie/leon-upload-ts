const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
import * as vscode from "vscode";
import leonParams from "./getLeonSetting";
const boundary = "----WebKitFormBoundaryAGJoBU0nvDkk5Xb0";

export const handleImageToLeon: any = async (localFile: string) => {
  const { apiUrl, userToken, assetKey, bucketName, folder } = leonParams || {};
  try {
    return new Promise((resolve, reject) => {
      if (!apiUrl || !userToken || !assetKey || !bucketName) {
        resolve({
          isOk: false,
          msg: "请前往setting对狮子座上传插件进行配置！",
        });
      }
      const URL = url.parse(apiUrl);
      const options = {
        method: "POST",
        hostname: URL.hostname,
        path: URL.path,
        headers: {
          "content-type": "multipart/form-data; boundary=" + boundary,
          "user-token": userToken,
          "asset-key": assetKey,
        },
      };
      let filename = path.basename(localFile);
      let extname = path.extname(localFile);
      if (extname === ".map") {
        filename = "-" + filename;
      }
      let mime = getMime(extname);

      let request = http.request(options, function (res: any) {
        let chunks: any[] = [];
        res.on("data", (chunk: any) => {
          chunks.push(chunk);
        });
        res.on("end", () => {
          let body = Buffer.concat(chunks);
          let jsonRes;
          try {
            jsonRes = JSON.parse(body.toString());
            // 成功后 组装一个在线地址返回回去
            if (jsonRes.code === 0) {
              resolve({
                isOk: true,
                url: `https://file.40017.cn/${bucketName}${folder}${filename}`,
              });
            } else {
              resolve({
                isOk: false,
                msg: "狮子座上传失败：" + (jsonRes.msg || ""),
              });
            }
          } catch (e) {
            reject(e);
          }
        });

        res.on("error", (e: any) => {
          // console.log("error", e);
          reject(e);
        });
      });
      request.on("error", function (e: any) {
        reject(e);
      });
      let fileStream = fs.createReadStream(localFile);

      request.write(
        `--${boundary}\r\nContent-Disposition: form-data; name="bucket_name"\r\n\r\n${bucketName}\r\n--${boundary}\r\nContent-Disposition: form-data; name="key"\r\n\r\n${folder}\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`
      );

      fileStream.pipe(request, { end: false });

      fileStream.on("end", () => {
        // console.log("end", "--------------------------")
        request.end(`\r\n--${boundary}--`);
      });

      fileStream.on("error", (e: any) => {
        // console.log(e);

        reject(e);
      });
    });
  } catch (error) {
    const message = error.message ? error.message : error;
    vscode.window.showErrorMessage(message);
  }
};

function getMime(extname: string) {
  let mime = new Map();
  mime.set(".css", "text/css");
  mime.set(".png", "image/png");
  mime.set(".gif", "image/gif");
  mime.set(".js", "application/javascript");
  mime.set(".pdf", "application/pdf");
  mime.set(".jpg", "image/jpeg");
  mime.set(".svg", "image/svg+xml");
  mime.set(".map", "text/plain");
  let res = "application/octet-stream";

  if (mime.get(extname)) {
    res = mime.get(extname);
  }

  return res;
}

export const addImageUrlToEditor = (url: string) => {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  // 替换内容
  const selection = editor.selection;
  editor.edit((editBuilder) => {
    editBuilder.replace(selection, url);
  });
};
