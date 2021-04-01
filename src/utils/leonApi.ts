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
            console.log(data);
            console.log(JSON.parse(data).explanation);
            resolve(data);
          });
        }
      )
      .on("error", (err: any) => {
        reject(err);
        console.log("Error: " + err.message);
      });
  });
};
