const roundValue = (value: number, decimals: number): number => {
  const result =
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

  return result;
};
