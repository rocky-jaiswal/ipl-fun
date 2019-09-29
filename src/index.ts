import AWS from 'aws-sdk';
import { Worker } from 'worker_threads';

AWS.config.update({
  region: 'eu-central-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const results: Array<any> = [];
const Bucket = 'de.rockyj.ipl-data';
const s3 = new AWS.S3();
let mostRunsMatch: any = null;

new Promise((resolve, reject) => {
  s3.listObjects({ Bucket }, (err, data) => {
    if (err) {
      console.error('Error', err);
      reject();
    }

    let count = 0;
    const numberToProcess = data.Contents!.length;

    data.Contents!.forEach(content => {
      const Key = content!.Key!;
      s3.getObject({ Bucket, Key }, (err, data) => {
        if (err) {
          console.error('Error', err);
        } else {
          const worker = new Worker('./dist/worker.js', { workerData: data.Body!.toString() });
          worker.once('message', message => {
            count += 1;
            results.push(message);
            if (count === numberToProcess) {
              resolve(results);
            }
          });
        }
      });
    });
  });
}).then((results: any) => {
  const finalResult = results.reduce((agg: any, result: any) => {
    if (result.runs.firstInnings.runs >= agg || result.runs.secondInnings.runs >= agg) {
      agg =
        result.runs.firstInnings.runs >= result.runs.secondInnings.runs
          ? result.runs.firstInnings.runs
          : result.runs.secondInnings.runs;
      mostRunsMatch = result;
    }
    return agg;
  }, 0);
  console.log(finalResult);
  console.log(mostRunsMatch);
});
