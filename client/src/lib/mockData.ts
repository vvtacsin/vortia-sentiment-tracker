export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  sentimentScore: number; // 0-100
  sentimentTrend: 'bullish' | 'bearish' | 'neutral';
  socialVolume: number;
  aiSummary: string;
  history: { time: string; value: number }[];
}

export const mockAssets: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 64231.45,
    change24h: 2.4,
    sentimentScore: 78,
    sentimentTrend: 'bullish',
    socialVolume: 124500,
    aiSummary: "Institutional inflow detected via ETF channels. Social sentiment is highly positive following recent regulatory clarity. On-chain metrics suggest accumulation phase.",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 60000 + Math.random() * 5000 }))
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3452.12,
    change24h: -1.2,
    sentimentScore: 45,
    sentimentTrend: 'neutral',
    socialVolume: 89200,
    aiSummary: "Mixed signals due to gas fee volatility. L2 activity is at all-time highs, but mainnet sentiment is cautious pending next upgrade.",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 3200 + Math.random() * 400 }))
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 145.67,
    change24h: 5.8,
    sentimentScore: 82,
    sentimentTrend: 'bullish',
    socialVolume: 67000,
    aiSummary: "Strong developer activity and new memecoin volume driving positive sentiment. Network stability has improved confidence scores.",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 130 + Math.random() * 30 }))
  },
  {
    id: 'vortia',
    symbol: 'VAI',
    name: 'Vortia AI',
    price: 0.85,
    change24h: 12.4,
    sentimentScore: 94,
    sentimentTrend: 'bullish',
    socialVolume: 15400,
    aiSummary: "Vortia Mainnet launch anticipation is driving extreme bullish sentiment. Community engagement metrics are up 300% week-over-week.",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 0.7 + Math.random() * 0.3 }))
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    change24h: -0.5,
    sentimentScore: 38,
    sentimentTrend: 'bearish',
    socialVolume: 32000,
    aiSummary: "Development activity remains high, but price action is lagging. Social sentiment is frustrated with slow rollout of governance features.",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 0.4 + Math.random() * 0.1 }))
  }
];

export const globalStats = {
  marketSentiment: 68, // Greed
  totalVolume: "1.2T",
  activeNodes: 1420,
  aiQueries24h: "2.4M"
};
