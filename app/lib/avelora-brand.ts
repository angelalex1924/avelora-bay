/** Coastal brand tokens — nav, CTAs, accents */
export const aveloraBrand = {
  gold: '#b8966e',
  goldLight: '#cdb08e',
  goldDark: '#9a7a58',
  charcoal: '#2c2420',
  sand: '#f2ece3',
  sandLight: '#f8f4ef',
  taupe: '#8a6f5a',
  ocean: '#8fb4b8',
  oceanDeep: '#5a8a8e',
} as const;

export const aveloraNavGradient = `linear-gradient(135deg, ${aveloraBrand.goldDark} 0%, ${aveloraBrand.gold} 52%, ${aveloraBrand.goldLight} 100%)`;
