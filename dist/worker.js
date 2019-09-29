"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const powerPlay_1 = require("./powerPlay");
const worker_threads_1 = require("worker_threads");
const match = powerPlay_1.parseMatch(worker_threads_1.workerData);
worker_threads_1.parentPort.postMessage({ dates: match.info.dates, runs: powerPlay_1.powerPlayRuns(match) });
//# sourceMappingURL=worker.js.map