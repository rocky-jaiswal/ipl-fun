import { parseMatch, powerPlayRuns } from './powerPlay';
import { workerData, parentPort } from 'worker_threads';

const match = parseMatch(workerData);
parentPort!.postMessage({ dates: match.info.dates, runs: powerPlayRuns(match) });
