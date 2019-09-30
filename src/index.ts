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

new Promise((resolve, reject) => {
  s3.listObjects({ Bucket }, (err, data) => {
    if (err) {
      console.error('Error', err);
      reject();
    }

    let count = 0;
    const numberToProcess = data.Contents!.length;

    const work = (rawData: string) => {
      const worker = new Worker('./dist/worker.js', { workerData: rawData });
      worker.once('message', message => {
        count += 1;
        results.push(message);
        if (count === numberToProcess) {
          resolve(results);
        }
      });
    };

    data.Contents!.forEach(content => {
      const Key = content!.Key!;
      s3.getObject({ Bucket, Key }, (err, yamlData) => {
        if (err) {
          console.error('Error', err);
          reject();
        } else {
          work(yamlData.Body!.toString());
        }
      });
    });
  });
}).then((results: any) => {
  const { finalResult, mostRunsMatch } = aggregateResult(results);
  console.log(finalResult);
  console.log(mostRunsMatch);
});
