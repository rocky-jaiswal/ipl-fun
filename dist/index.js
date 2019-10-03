"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const worker_threads_1 = require("worker_threads");
const aggregateResult_1 = require("./aggregateResult");
aws_sdk_1.default.config.update({
    region: 'eu-central-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new aws_sdk_1.default.S3();
const Bucket = 'de.rockyj.ipl-data';
const results = [];
let processed = 0;
let totalNumberToProcess = 0;
const workInThread = (rawData, resolve) => {
    const worker = new worker_threads_1.Worker('./dist/worker.js', { workerData: rawData });
    worker.once('message', message => {
        results.push(message);
        processed += 1;
        if (processed === totalNumberToProcess) {
            resolve(results);
        }
    });
};
const processS3Bucket = (s3Data, reject, resolve) => {
    totalNumberToProcess = s3Data.length;
    s3Data.forEach((content) => s3.getObject({ Bucket, Key: content.Key }, (err, yamlData) => processS3Object(err, yamlData, reject, resolve)));
};
const processS3Object = (err, yamlData, reject, resolve) => {
    if (!err) {
        workInThread(yamlData.Body.toString(), resolve);
    }
    else {
        console.error(err);
        reject();
    }
};
new Promise((resolve, reject) => {
    s3.listObjects({ Bucket }, (err, data) => {
        if (err) {
            console.error(err);
            reject();
        }
        processS3Bucket(data.Contents, reject, resolve);
    });
}).then((results) => {
    const { finalResult, mostRunsMatch } = aggregateResult_1.aggregateResult(results);
    console.log(finalResult);
    console.log(mostRunsMatch);
});
//# sourceMappingURL=index.js.map