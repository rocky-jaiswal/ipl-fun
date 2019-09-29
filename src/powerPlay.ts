import yaml from 'js-yaml';

export const parseMatch = (yamlPayload: string) => {
  return yaml.load(yamlPayload);
};

export const aggregateRunsForPowerPlay = (inningsDeliveries: any) => {
  const powerPlayDeliveries = inningsDeliveries.filter((d: any) => parseFloat(Object.keys(d)[0]) < 6.1);
  const powerPlayRuns = powerPlayDeliveries.map((d: any) => Object.values(d)[0]);

  return powerPlayRuns
    .map((d: any) => d['runs']['total'])
    .reduce((agg: number, runs: number) => {
      agg = agg + runs;
      return agg;
    }, 0);
};

export const powerPlayRuns = (match: any) => {
  const firstInnings = match.innings[0]['1st innings'];
  // Handle case if there was a washout
  const secondInnings = (match.innings[1] || { '2nd innings': { deliveries: [] } })['2nd innings'];

  const firstInningsDeliveries = firstInnings['deliveries'];
  const secondInningsDeliveries = secondInnings['deliveries'];

  return {
    firstInnings: { team: firstInnings['team'], runs: aggregateRunsForPowerPlay(firstInningsDeliveries) },
    secondInnings: { team: secondInnings['team'], runs: aggregateRunsForPowerPlay(secondInningsDeliveries) }
  };
};
