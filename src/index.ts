import AWS from 'aws-sdk';
import { Worker } from 'worker_threads';

import { aggregateResult } from './aggregateResult';

AWS.config.update({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const Bucket = 'de.rockyj.ipl-data';
const results: Array<any> = [];

let processed = 0;
let totalNumberToProcess = 0;

const workInThread = (rawData: string, resolve: Function) => {
  const worker = new Worker('./dist/worker.js', { workerData: rawData });
  worker.once('message', message => {
    results.push(message);
    processed += 1;
    if (processed === totalNumberToProcess) {
      resolve(results);
    }
  });
};

const processS3Bucket = (s3Data: any, reject: Function, resolve: Function) => {
  totalNumberToProcess = s3Data.length;
  s3Data.forEach((content: any) =>
    s3.getObject({ Bucket, Key: content!.Key! }, (err, yamlData) =>
      processS3Object(err, yamlData, reject, resolve)
    )
  );
};

const processS3Object = (err: any, yamlData: any, reject: Function, resolve: Function) => {
  if (!err) {
    workInThread(yamlData.Body!.toString(), resolve);
  } else {
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

    processS3Bucket(data.Contents!, reject, resolve);
  });
}).then((results: any) => {
  const { finalResult, mostRunsMatch } = aggregateResult(results);
  console.log(finalResult);
  console.log(mostRunsMatch);
});
