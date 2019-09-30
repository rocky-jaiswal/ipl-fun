"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateResult = (results) => {
    let mostRunsMatch = null;
    const finalResult = results.reduce((agg, result) => {
        if (result.runs.firstInnings.runs >= agg || result.runs.secondInnings.runs >= agg) {
            agg =
                result.runs.firstInnings.runs >= result.runs.secondInnings.runs
                    ? result.runs.firstInnings.runs
                    : result.runs.secondInnings.runs;
            mostRunsMatch = result;
        }
        return agg;
    }, 0);
    return { finalResult, mostRunsMatch };
};
//# sourceMappingURL=aggregateResult.js.map