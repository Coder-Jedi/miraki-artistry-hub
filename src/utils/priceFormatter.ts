
// Convert USD price to INR (using a fixed exchange rate for demo)
const USD_TO_INR_RATE = 83;

export const formatPrice = (priceUSD?: number) => {
  if (!priceUSD) return undefined;
  const priceINR = Math.round(priceUSD * USD_TO_INR_RATE);
  return `₹${priceINR.toLocaleString('en-IN')}`;
};
