export const aggregateResult = (results: any[]) => {
  let mostRunsMatch: any = null;

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

  return { finalResult, mostRunsMatch };
};
