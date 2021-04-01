"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataList = exports.getBuckets = void 0;
const http = require("http");
const getLeonSetting_1 = require("./getLeonSetting");
const getBuckets = () => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "content-type": "application/json;",
                "user-token": getLeonSetting_1.default.userToken,
                "asset-key": getLeonSetting_1.default.assetKey,
            },
        };
        http
            .get("http://leonidapi.17usoft.com/libraapi2/leonid/v2/static/bucket/list?is_name=0", options, (resp) => {
            let data = "";
            resp.on("data", (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                resolve(JSON.parse(data));
            });
        })
            .on("error", (err) => {
            reject(err);
            console.log("Error: " + err.message);
        });
    });
};
exports.getBuckets = getBuckets;
const getDataList = (bucketName, key = '/') => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "content-type": "application/json;",
                "user-token": getLeonSetting_1.default.userToken,
                "asset-key": getLeonSetting_1.default.assetKey,
            },
        };
        const url = "http://leonidapi.17usoft.com/libraapi2/leonid/v2/static/object";
        console.log(`${url}?bucket_name=${bucketName}&key=${key}&limit=10000`);
        http
            .get(`${url}?bucket_name=${bucketName}&key=${key}&limit=10000`, options, (resp) => {
            let data = "";
            resp.on("data", (chunk) => {
                data += chunk;
            });
            resp.on("end", () => {
                resolve(JSON.parse(data));
            });
        })
            .on("error", (err) => {
            reject(err);
            console.log("Error: " + err.message);
        });
    });
};
exports.getDataList = getDataList;
//# sourceMappingURL=leonApi.js.map