const http = require("http");
import leonParams from "./getLeonSetting";

export const getBuckets = () => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "content-type": "application/json;",
        "user-token": leonParams.userToken,
        "asset-key": leonParams.assetKey,
      },
    };
    http
      .get(
        "http://leonidapi.17usoft.com/libraapi2/leonid/v2/static/bucket/list?is_name=0",
        options,
        (resp: any) => {
          let data = "";
          resp.on("data", (chunk: any) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on("end", () => {
            resolve(JSON.parse(data));
          });
        }
      )
      .on("error", (err: any) => {
        reject(err);
        console.log("Error: " + err.message);
      });
  });
};

export const getDataList = (bucketName: string, key: string = "/") => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "content-type": "application/json;",
        "user-token": leonParams.userToken,
        "asset-key": leonParams.assetKey,
      },
    };
    const url =
      "http://leonidapi.17usoft.com/libraapi2/leonid/v2/static/object";
    console.log(`${url}?bucket_name=${bucketName}&key=${key}&limit=10000`);
    http
      .get(
        `${url}?bucket_name=${bucketName}&key=${key}&limit=10000`,
        options,
        (resp: any) => {
          let data = "";
          resp.on("data", (chunk: any) => {
            data += chunk;
          });

          resp.on("end", () => {
            resolve(JSON.parse(data));
          });
        }
      )
      .on("error", (err: any) => {
        reject(err);
        console.log("Error: " + err.message);
      });
  });
};
