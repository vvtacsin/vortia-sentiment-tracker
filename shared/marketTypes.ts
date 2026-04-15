// Market data types shared between frontend and backend

export interface HistoryPoint {
  time: string;
  price: number;
  sentiment: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  sentimentScore: number;
  sentimentTrend: "bullish" | "bearish" | "neutral";
  history: HistoryPoint[];
  image?: string;
}

export interface GlobalStats {
  marketSentiment: number;
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  aiQueries24h: string;
  activeCryptos: number;
}

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
  symbol: string;
  timestamp: string;
}
