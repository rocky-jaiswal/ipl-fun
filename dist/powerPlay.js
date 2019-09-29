"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = __importDefault(require("js-yaml"));
exports.parseMatch = (yamlPayload) => {
    return js_yaml_1.default.load(yamlPayload);
};
exports.aggregateRunsForPowerPlay = (inningsDeliveries) => {
    const powerPlayDeliveries = inningsDeliveries.filter((d) => parseFloat(Object.keys(d)[0]) < 6.1);
    const powerPlayRuns = powerPlayDeliveries.map((d) => Object.values(d)[0]);
    return powerPlayRuns
        .map((d) => d['runs']['total'])
        .reduce((agg, runs) => {
        agg = agg + runs;
        return agg;
    }, 0);
};
exports.powerPlayRuns = (match) => {
    const firstInnings = match.innings[0]['1st innings'];
    // Handle case if there was a washout
    const secondInnings = (match.innings[1] || { '2nd innings': { deliveries: [] } })['2nd innings'];
    const firstInningsDeliveries = firstInnings['deliveries'];
    const secondInningsDeliveries = secondInnings['deliveries'];
    return {
        firstInnings: { team: firstInnings['team'], runs: exports.aggregateRunsForPowerPlay(firstInningsDeliveries) },
        secondInnings: { team: secondInnings['team'], runs: exports.aggregateRunsForPowerPlay(secondInningsDeliveries) }
    };
};
//# sourceMappingURL=powerPlay.js.map