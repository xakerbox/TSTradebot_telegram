export const roundValue = (value: number, decimals: number): number => {
  return Math.round(value * (Math.pow(10, decimals) / Math.pow(10, decimals)));
};
