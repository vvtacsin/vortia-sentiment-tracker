import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

// Simulated price data (in production, would fetch from CoinGecko)
const COIN_PRICES: Record<string, number> = {
  BTC: 97500,
  ETH: 3250,
  SOL: 245,
  ADA: 1.05,
  DOT: 7.85,
  AVAX: 42.50,
  MATIC: 0.52,
  LINK: 24.80,
  UNI: 14.20,
  ATOM: 9.45,
  VAI: 0.85,
};

// Volatility scores (higher = more volatile)
const VOLATILITY: Record<string, number> = {
  BTC: 35,
  ETH: 45,
  SOL: 70,
  ADA: 55,
  DOT: 60,
  AVAX: 65,
  MATIC: 60,
  LINK: 50,
  UNI: 55,
  ATOM: 50,
  VAI: 80,
};

// Correlation groups (assets in same group are correlated)
const CORRELATION_GROUPS: Record<string, string> = {
  BTC: 'btc',
  ETH: 'eth-ecosystem',
  SOL: 'alt-l1',
  ADA: 'alt-l1',
  DOT: 'alt-l1',
  AVAX: 'alt-l1',
  MATIC: 'eth-ecosystem',
  LINK: 'defi',
  UNI: 'defi',
  ATOM: 'cosmos',
  VAI: 'ai',
};

interface Holding {
  symbol: string;
  amount: number;
}

function calculateRiskMetrics(holdings: Holding[]) {
  // Calculate total value
  const portfolioValue = holdings.reduce((sum, h) => {
    const price = COIN_PRICES[h.symbol] || 0;
    return sum + (h.amount * price);
  }, 0);

  if (portfolioValue === 0) {
    return {
      overallScore: 50,
      diversificationScore: 50,
      volatilityScore: 50,
      correlationScore: 50,
      liquidityScore: 50,
      concentrationScore: 50,
    };
  }

  // Calculate weights
  const weights = holdings.map(h => ({
    symbol: h.symbol,
    weight: (h.amount * (COIN_PRICES[h.symbol] || 0)) / portfolioValue,
  }));

  // Diversification score (more assets = better, up to a point)
  const numAssets = holdings.length;
  const diversificationScore = Math.min(100, 30 + (numAssets * 15));

  // Volatility score (weighted average, inverted so lower volatility = higher score)
  const weightedVolatility = weights.reduce((sum, w) => {
    return sum + (w.weight * (VOLATILITY[w.symbol] || 50));
  }, 0);
  const volatilityScore = Math.max(0, 100 - weightedVolatility);

  // Correlation score (more unique groups = better)
  const groups = new Set(holdings.map(h => CORRELATION_GROUPS[h.symbol] || 'other'));
  const correlationScore = Math.min(100, 20 + (groups.size * 20));

  // Liquidity score (BTC/ETH heavy = better liquidity)
  const majorCoinsWeight = weights
    .filter(w => ['BTC', 'ETH'].includes(w.symbol))
    .reduce((sum, w) => sum + w.weight, 0);
  const liquidityScore = Math.min(100, 40 + (majorCoinsWeight * 60));

  // Concentration score (more evenly distributed = better)
  const maxWeight = Math.max(...weights.map(w => w.weight));
  const concentrationScore = Math.max(0, 100 - (maxWeight * 100));

  // Overall score (weighted average of all metrics)
  const overallScore = Math.round(
    (diversificationScore * 0.2) +
    (volatilityScore * 0.25) +
    (correlationScore * 0.2) +
    (liquidityScore * 0.15) +
    (concentrationScore * 0.2)
  );

  return {
    overallScore,
    diversificationScore: Math.round(diversificationScore),
    volatilityScore: Math.round(volatilityScore),
    correlationScore: Math.round(correlationScore),
    liquidityScore: Math.round(liquidityScore),
    concentrationScore: Math.round(concentrationScore),
  };
}

async function generateAIInsight(holdings: Holding[], metrics: ReturnType<typeof calculateRiskMetrics>) {
  const portfolioValue = holdings.reduce((sum, h) => {
    const price = COIN_PRICES[h.symbol] || 0;
    return sum + (h.amount * price);
  }, 0);

  const holdingsSummary = holdings.map(h => {
    const price = COIN_PRICES[h.symbol] || 0;
    const value = h.amount * price;
    const percentage = (value / portfolioValue * 100).toFixed(1);
    return `${h.symbol}: ${h.amount} units ($${value.toLocaleString()}, ${percentage}%)`;
  }).join('\n');

  const prompt = `You are Vortia AI, an expert cryptocurrency portfolio risk analyst. Analyze this portfolio and provide actionable insights.

PORTFOLIO HOLDINGS:
${holdingsSummary}

TOTAL VALUE: $${portfolioValue.toLocaleString()}

RISK METRICS:
- Overall Risk Score: ${metrics.overallScore}/100
- Diversification: ${metrics.diversificationScore}/100
- Volatility Exposure: ${metrics.volatilityScore}/100 (higher = less volatile)
- Correlation Risk: ${metrics.correlationScore}/100 (higher = less correlated)
- Liquidity: ${metrics.liquidityScore}/100
- Concentration: ${metrics.concentrationScore}/100 (higher = more evenly distributed)

Provide a concise analysis (3-4 sentences) covering:
1. Overall portfolio health assessment
2. Key risks identified
3. One specific actionable recommendation

Be professional and data-driven. Do not use emojis.`;

  try {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: "You are Vortia AI, a professional cryptocurrency portfolio analyst. Provide concise, actionable insights based on the data provided." },
        { role: "user", content: prompt }
      ],
    });

    const content = result.choices[0]?.message?.content;
    if (typeof content === "string") {
      return content;
    }
    return "Portfolio analysis complete. Your holdings show moderate diversification with exposure to major cryptocurrencies. Consider rebalancing to reduce concentration risk.";
  } catch (error) {
    console.error("LLM error:", error);
    return "Portfolio analysis complete. Your holdings show moderate diversification with exposure to major cryptocurrencies. Consider rebalancing to reduce concentration risk.";
  }
}

function generateStrengths(holdings: Holding[], metrics: ReturnType<typeof calculateRiskMetrics>): string[] {
  const strengths: string[] = [];
  
  if (metrics.diversificationScore >= 60) {
    strengths.push("Good diversification across multiple assets");
  }
  if (metrics.liquidityScore >= 60) {
    strengths.push("Strong allocation to high-liquidity assets");
  }
  if (metrics.volatilityScore >= 50) {
    strengths.push("Balanced volatility exposure");
  }
  if (holdings.some(h => h.symbol === 'BTC')) {
    strengths.push("Bitcoin provides portfolio stability");
  }
  if (holdings.some(h => h.symbol === 'VAI')) {
    strengths.push("Early exposure to AI-crypto sector");
  }
  
  return strengths.length > 0 ? strengths.slice(0, 3) : ["Portfolio has room for optimization"];
}

function generateRecommendations(holdings: Holding[], metrics: ReturnType<typeof calculateRiskMetrics>): string[] {
  const recommendations: string[] = [];
  
  if (metrics.diversificationScore < 60) {
    recommendations.push("Add more assets to improve diversification");
  }
  if (metrics.concentrationScore < 50) {
    recommendations.push("Rebalance to reduce concentration in top holdings");
  }
  if (metrics.liquidityScore < 50) {
    recommendations.push("Increase allocation to BTC/ETH for better liquidity");
  }
  if (metrics.volatilityScore < 40) {
    recommendations.push("Consider adding stablecoins to reduce volatility");
  }
  if (!holdings.some(h => h.symbol === 'VAI')) {
    recommendations.push("Consider VAI for AI-crypto exposure");
  }
  
  return recommendations.length > 0 ? recommendations.slice(0, 3) : ["Portfolio is well-balanced"];
}

export const portfolioRouter = router({
  analyzeRisk: publicProcedure
    .input(z.object({
      holdings: z.array(z.object({
        symbol: z.string(),
        amount: z.number(),
      })),
    }))
    .query(async ({ input }) => {
      const { holdings } = input;
      
      if (holdings.length === 0) {
        return {
          overallScore: 50,
          diversificationScore: 50,
          volatilityScore: 50,
          correlationScore: 50,
          liquidityScore: 50,
          concentrationScore: 50,
          aiInsight: null,
          strengths: [],
          recommendations: ["Add holdings to analyze your portfolio"],
        };
      }

      const metrics = calculateRiskMetrics(holdings);
      const aiInsight = await generateAIInsight(holdings, metrics);
      const strengths = generateStrengths(holdings, metrics);
      const recommendations = generateRecommendations(holdings, metrics);

      return {
        ...metrics,
        aiInsight,
        strengths,
        recommendations,
      };
    }),
});
