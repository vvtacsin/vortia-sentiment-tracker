import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

// CoinGecko API base URL (free tier)
const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Supported coins mapping
const COIN_IDS: Record<string, string> = {
  // Major Cryptocurrencies
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  TRX: "tron",
  // DeFi & Layer 2
  LINK: "chainlink",
  MATIC: "matic-network",
  UNI: "uniswap",
  AAVE: "aave",
  LDO: "lido-dao",
  ARB: "arbitrum",
  OP: "optimism",
  // Layer 1 Alternatives
  ATOM: "cosmos",
  NEAR: "near",
  APT: "aptos",
  SUI: "sui",
  FTM: "fantom",
  ALGO: "algorand",
  // AI & Data Tokens
  FET: "fetch-ai",
  RNDR: "render-token",
  INJ: "injective-protocol",
  GRT: "the-graph",
  // Meme Coins
  SHIB: "shiba-inu",
  PEPE: "pepe",
  BONK: "bonk",
};

// In-memory cache for market data
let marketDataCache: any = null;
let marketDataCacheTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

let globalStatsCache: any = null;
let globalStatsCacheTime = 0;

// Fallback data when API is rate limited
const FALLBACK_DATA = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", current_price: 97500, price_change_percentage_24h: 2.4, market_cap: 1920000000000, total_volume: 45000000000, image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 95000 + Math.sin(i / 10) * 2000 + Math.random() * 500) } },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", current_price: 3250, price_change_percentage_24h: 1.8, market_cap: 390000000000, total_volume: 18000000000, image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 3100 + Math.sin(i / 10) * 150 + Math.random() * 50) } },
  { id: "solana", symbol: "SOL", name: "Solana", current_price: 245, price_change_percentage_24h: 5.2, market_cap: 115000000000, total_volume: 4500000000, image: "https://assets.coingecko.com/coins/images/4128/small/solana.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 230 + Math.sin(i / 10) * 15 + Math.random() * 5) } },
  { id: "cardano", symbol: "ADA", name: "Cardano", current_price: 1.05, price_change_percentage_24h: -0.8, market_cap: 37000000000, total_volume: 850000000, image: "https://assets.coingecko.com/coins/images/975/small/cardano.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 1.0 + Math.sin(i / 10) * 0.05 + Math.random() * 0.02) } },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", current_price: 7.85, price_change_percentage_24h: 3.1, market_cap: 11500000000, total_volume: 420000000, image: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 7.5 + Math.sin(i / 10) * 0.4 + Math.random() * 0.1) } },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", current_price: 42.50, price_change_percentage_24h: 4.5, market_cap: 17500000000, total_volume: 680000000, image: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 40 + Math.sin(i / 10) * 3 + Math.random() * 1) } },
  { id: "matic-network", symbol: "MATIC", name: "Polygon", current_price: 0.52, price_change_percentage_24h: -1.2, market_cap: 5200000000, total_volume: 320000000, image: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 0.50 + Math.sin(i / 10) * 0.03 + Math.random() * 0.01) } },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", current_price: 24.80, price_change_percentage_24h: 2.9, market_cap: 15500000000, total_volume: 890000000, image: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 23.5 + Math.sin(i / 10) * 1.5 + Math.random() * 0.5) } },
  { id: "uniswap", symbol: "UNI", name: "Uniswap", current_price: 14.20, price_change_percentage_24h: 1.5, market_cap: 10700000000, total_volume: 280000000, image: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 13.5 + Math.sin(i / 10) * 0.8 + Math.random() * 0.3) } },
  { id: "cosmos", symbol: "ATOM", name: "Cosmos", current_price: 9.45, price_change_percentage_24h: 0.6, market_cap: 3700000000, total_volume: 180000000, image: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png", sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 9.2 + Math.sin(i / 10) * 0.3 + Math.random() * 0.1) } },
];

// Fetch market data from CoinGecko with caching
async function fetchMarketData() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (marketDataCache && (now - marketDataCacheTime) < CACHE_DURATION) {
    return marketDataCache;
  }
  
  try {
    const ids = Object.values(COIN_IDS).join(",");
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`;
    
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429) {
        console.log("CoinGecko rate limited, using fallback data");
        return FALLBACK_DATA;
      }
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update cache
    marketDataCache = data;
    marketDataCacheTime = now;
    
    return data;
  } catch (error) {
    console.error("Market data fetch error:", error);
    // Return fallback data on any error
    return FALLBACK_DATA;
  }
}

// Fetch price history for a specific coin
async function fetchPriceHistory(coinId: string, days: number = 7) {
  const url = `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

// Generate AI sentiment analysis for a coin
async function generateSentimentAnalysis(coinName: string, price: number, change24h: number, marketCap: number) {
  const prompt = `You are Vortia AI, an advanced cryptocurrency sentiment analysis oracle. Analyze the following market data and provide a brief, insightful sentiment analysis (2-3 sentences max).

Coin: ${coinName}
Current Price: $${price.toLocaleString()}
24h Change: ${change24h.toFixed(2)}%
Market Cap: $${marketCap.toLocaleString()}

Provide your analysis focusing on:
1. Current market sentiment (bullish/bearish/neutral)
2. Key factors driving the price action
3. Short-term outlook

Keep your response concise and professional. Do not use emojis.`;

  try {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: "You are Vortia AI, a professional cryptocurrency market analyst. Provide concise, data-driven insights." },
        { role: "user", content: prompt }
      ],
    });

    const content = result.choices[0]?.message?.content;
    if (typeof content === "string") {
      return content;
    }
    return "AI analysis temporarily unavailable.";
  } catch (error) {
    console.error("LLM error:", error);
    return "AI analysis temporarily unavailable.";
  }
}

// Calculate sentiment score based on price action and market data
function calculateSentimentScore(change24h: number, sparkline: number[]): number {
  // Base score from 24h change
  let score = 50 + (change24h * 2);
  
  // Adjust based on recent trend (last 24 points of sparkline)
  if (sparkline && sparkline.length > 24) {
    const recent = sparkline.slice(-24);
    const trend = (recent[recent.length - 1] - recent[0]) / recent[0] * 100;
    score += trend * 0.5;
  }
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

export const marketRouter = router({
  // Get all tracked assets with live data
  getAssets: publicProcedure.query(async () => {
    const marketData = await fetchMarketData();
    
    const assets = marketData.map((coin: any) => {
      const symbol = Object.entries(COIN_IDS).find(([_, id]) => id === coin.id)?.[0] || coin.symbol.toUpperCase();
      const sparkline = coin.sparkline_in_7d?.price || [];
      
      return {
        id: coin.id,
        symbol,
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        sentimentScore: calculateSentimentScore(coin.price_change_percentage_24h || 0, sparkline),
        sentimentTrend: (coin.price_change_percentage_24h || 0) > 2 ? "bullish" : (coin.price_change_percentage_24h || 0) < -2 ? "bearish" : "neutral",
        history: sparkline.slice(-48).map((price: number, index: number) => ({
          time: `${Math.floor(index / 2)}h`,
          price: price,
          sentiment: calculateSentimentScore((sparkline[index] - sparkline[Math.max(0, index - 1)]) / sparkline[Math.max(0, index - 1)] * 100, sparkline.slice(0, index + 1))
        })),
        image: coin.image,
      };
    });

    // Add VAI token (mock data since it's not on CoinGecko)
    assets.push({
      id: "vortia-ai",
      symbol: "VAI",
      name: "Vortia AI",
      price: 0.85,
      change24h: 12.4,
      marketCap: 85000000,
      volume24h: 2400000,
      sentimentScore: 82,
      sentimentTrend: "bullish",
      history: Array.from({ length: 48 }, (_, i) => ({
        time: `${Math.floor(i / 2)}h`,
        price: 0.75 + Math.random() * 0.2,
        sentiment: 75 + Math.random() * 15
      })),
      image: "/logo-icon.png",
    });

    return assets;
  }),

  // Get AI analysis for a specific asset
  getAIAnalysis: publicProcedure
    .input(z.object({
      coinId: z.string(),
      coinName: z.string(),
      price: z.number(),
      change24h: z.number(),
      marketCap: z.number(),
    }))
    .query(async ({ input }) => {
      const analysis = await generateSentimentAnalysis(
        input.coinName,
        input.price,
        input.change24h,
        input.marketCap
      );
      
      return { analysis };
    }),

  // Get price history for charts
  getPriceHistory: publicProcedure
    .input(z.object({
      coinId: z.string(),
      days: z.number().optional().default(7),
    }))
    .query(async ({ input }) => {
      try {
        const data = await fetchPriceHistory(input.coinId, input.days);
        
        return {
          prices: data.prices.map(([timestamp, price]: [number, number]) => ({
            time: new Date(timestamp).toISOString(),
            price,
          })),
        };
      } catch (error) {
        console.error("Price history fetch error:", error);
        throw new Error("Failed to fetch price history");
      }
    }),

  // Get global market stats
  getGlobalStats: publicProcedure.query(async () => {
    const now = Date.now();
    
    // Return cached data if still valid
    if (globalStatsCache && (now - globalStatsCacheTime) < CACHE_DURATION) {
      return globalStatsCache;
    }
    
    try {
      const response = await fetch(`${COINGECKO_API}/global`);
      if (!response.ok) {
        if (response.status === 429) {
          console.log("CoinGecko rate limited for global stats, using defaults");
          return {
            marketSentiment: 68,
            totalMarketCap: 3200000000000,
            totalVolume24h: 125000000000,
            btcDominance: 58.5,
            aiQueries24h: "2.4M",
            activeCryptos: 14500,
          };
        }
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      const globalData = data.data;
      
      // Calculate market sentiment from BTC dominance and market cap change
      const marketSentiment = Math.round(
        50 + (globalData.market_cap_change_percentage_24h_usd || 0) * 2
      );
      
      const result = {
        marketSentiment: Math.max(0, Math.min(100, marketSentiment)),
        totalMarketCap: globalData.total_market_cap?.usd || 0,
        totalVolume24h: globalData.total_volume?.usd || 0,
        btcDominance: globalData.market_cap_percentage?.btc || 0,
        aiQueries24h: "2.4M",
        activeCryptos: globalData.active_cryptocurrencies || 0,
      };
      
      // Update cache
      globalStatsCache = result;
      globalStatsCacheTime = now;
      
      return result;
    } catch (error) {
      console.error("Global stats fetch error:", error);
      return {
        marketSentiment: 68,
        totalMarketCap: 3200000000000,
        totalVolume24h: 125000000000,
        btcDominance: 58.5,
        aiQueries24h: "2.4M",
        activeCryptos: 14500,
      };
    }
  }),
});
