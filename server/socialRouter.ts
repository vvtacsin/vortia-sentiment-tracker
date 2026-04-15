import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

// Simulated Twitter/X data for crypto mentions
// In production, this would use Twitter API or a social listening service

interface Tweet {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  coins: string[];
  verified: boolean;
}

// Sample crypto influencers and their typical sentiment patterns
const INFLUENCERS = [
  { name: "CryptoWhale", handle: "@CryptoWhale", avatar: "🐋", verified: true },
  { name: "BitcoinMagazine", handle: "@BitcoinMagazine", avatar: "₿", verified: true },
  { name: "VitalikButerin", handle: "@VitalikButerin", avatar: "🔷", verified: true },
  { name: "CryptoAnalyst", handle: "@CryptoAnalyst", avatar: "📊", verified: false },
  { name: "DeFi_Dad", handle: "@DeFi_Dad", avatar: "👨‍💻", verified: true },
  { name: "AltcoinDaily", handle: "@AltcoinDaily", avatar: "📈", verified: true },
  { name: "Crypto_Rand", handle: "@Crypto_Rand", avatar: "🎲", verified: false },
  { name: "TheCryptoLark", handle: "@TheCryptoLark", avatar: "🐦", verified: true },
  { name: "SolanaNews", handle: "@SolanaNews", avatar: "☀️", verified: true },
  { name: "ETHNews", handle: "@ETHNews", avatar: "💎", verified: true },
];

// Sample tweet templates with sentiment
const TWEET_TEMPLATES = {
  positive: [
    { content: "🚀 {coin} looking incredibly strong right now! The momentum is building and we could see new ATH soon. #Crypto #Bullish", coins: ["BTC", "ETH", "SOL"] },
    { content: "Just analyzed the {coin} charts - accumulation phase complete. Smart money is loading up. This is the calm before the storm. 📈", coins: ["BTC", "ETH"] },
    { content: "Breaking: Major institutional adoption news for {coin}! This is exactly what we've been waiting for. Mass adoption incoming! 🏦", coins: ["BTC", "ETH", "SOL"] },
    { content: "{coin} network activity hitting new records. On-chain metrics are screaming bullish. Don't sleep on this one! 💪", coins: ["ETH", "SOL", "AVAX"] },
    { content: "The {coin} ecosystem is absolutely thriving. Developer activity up 300% YoY. Building through the bear market pays off! 🔨", coins: ["ETH", "SOL", "DOT"] },
    { content: "AI + Crypto is the future. Projects like $VAI are leading the charge. The convergence is happening NOW! 🤖", coins: ["VAI"] },
    { content: "{coin} whale accumulation at these levels is insane. Big players know something we don't. Follow the smart money! 🐋", coins: ["BTC", "ETH"] },
  ],
  negative: [
    { content: "⚠️ Warning: {coin} showing bearish divergence on the daily. Could see a pullback to support. Stay cautious. #Trading", coins: ["BTC", "ETH", "SOL"] },
    { content: "Not looking good for {coin} short term. Breaking below key support. Waiting for better entries. 📉", coins: ["SOL", "ADA", "DOT"] },
    { content: "Concerning news for {coin} - regulatory pressure mounting. This could impact price action significantly. Stay informed.", coins: ["BTC", "ETH"] },
    { content: "{coin} network congestion causing issues again. Scalability concerns are valid. Competition is catching up fast.", coins: ["ETH", "SOL"] },
    { content: "Whale wallets dumping {coin}. On-chain data shows distribution phase. Be careful out there! 🔴", coins: ["BTC", "ETH", "SOL"] },
  ],
  neutral: [
    { content: "Interesting developments in the {coin} ecosystem. Watching closely for the next move. What's your take? 🤔", coins: ["BTC", "ETH", "SOL", "ADA"] },
    { content: "{coin} consolidating in a tight range. Could break either way. Setting alerts for key levels. ⏰", coins: ["BTC", "ETH"] },
    { content: "New {coin} update rolling out. Mixed reactions from the community. Time will tell if this is the right direction.", coins: ["ETH", "SOL", "DOT"] },
    { content: "Market update: {coin} trading sideways. Volume decreasing. Waiting for a catalyst to determine direction. 📊", coins: ["BTC", "ETH", "SOL"] },
    { content: "Comparing {coin} metrics to last cycle. Some similarities, some differences. History doesn't repeat but it rhymes.", coins: ["BTC", "ETH"] },
  ],
};

// Generate realistic mock tweets
function generateMockTweets(count: number = 20, coinFilter?: string): Tweet[] {
  const tweets: Tweet[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    // Determine sentiment (weighted towards positive in bull market)
    const sentimentRoll = Math.random();
    let sentiment: 'positive' | 'negative' | 'neutral';
    let sentimentScore: number;
    
    if (sentimentRoll < 0.5) {
      sentiment = 'positive';
      sentimentScore = 65 + Math.floor(Math.random() * 30); // 65-95
    } else if (sentimentRoll < 0.75) {
      sentiment = 'neutral';
      sentimentScore = 40 + Math.floor(Math.random() * 20); // 40-60
    } else {
      sentiment = 'negative';
      sentimentScore = 10 + Math.floor(Math.random() * 30); // 10-40
    }

    // Select template
    const templates = TWEET_TEMPLATES[sentiment];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Filter by coin if specified
    let availableCoins = template.coins;
    if (coinFilter && !availableCoins.includes(coinFilter)) {
      // Add the filtered coin to make it relevant
      availableCoins = [coinFilter];
    }
    
    const coin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
    const content = template.content.replace(/{coin}/g, `$${coin}`);

    // Select influencer
    const influencer = INFLUENCERS[Math.floor(Math.random() * INFLUENCERS.length)];

    // Generate engagement metrics (higher for verified accounts)
    const baseEngagement = influencer.verified ? 1000 : 100;
    const likes = Math.floor(Math.random() * baseEngagement * 10) + baseEngagement;
    const retweets = Math.floor(likes * (0.1 + Math.random() * 0.3));

    // Generate timestamp (within last 24 hours)
    const timestamp = new Date(now - Math.floor(Math.random() * 24 * 60 * 60 * 1000));

    tweets.push({
      id: `tweet_${i}_${Date.now()}`,
      author: influencer.name,
      handle: influencer.handle,
      avatar: influencer.avatar,
      content,
      timestamp,
      likes,
      retweets,
      sentiment,
      sentimentScore,
      coins: [coin],
      verified: influencer.verified,
    });
  }

  // Sort by timestamp (newest first)
  return tweets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Calculate aggregate sentiment from tweets
function calculateAggregateSentiment(tweets: Tweet[]) {
  if (tweets.length === 0) {
    return { score: 50, trend: 'neutral' as const, positive: 0, negative: 0, neutral: 0 };
  }

  const positive = tweets.filter(t => t.sentiment === 'positive').length;
  const negative = tweets.filter(t => t.sentiment === 'negative').length;
  const neutral = tweets.filter(t => t.sentiment === 'neutral').length;

  // Weighted average sentiment score
  const totalScore = tweets.reduce((sum, t) => sum + t.sentimentScore, 0);
  const avgScore = Math.round(totalScore / tweets.length);

  // Determine trend
  let trend: 'bullish' | 'bearish' | 'neutral';
  if (positive > negative * 1.5) {
    trend = 'bullish';
  } else if (negative > positive * 1.5) {
    trend = 'bearish';
  } else {
    trend = 'neutral';
  }

  return {
    score: avgScore,
    trend,
    positive,
    negative,
    neutral,
    total: tweets.length,
  };
}

// Generate AI summary of social sentiment
async function generateSocialSummary(tweets: Tweet[], coin?: string) {
  const sentiment = calculateAggregateSentiment(tweets);
  const topTweets = tweets.slice(0, 5).map(t => t.content).join('\n');

  const prompt = `You are Vortia AI, analyzing social media sentiment for cryptocurrency${coin ? ` ${coin}` : ' markets'}.

SENTIMENT DATA:
- Overall Score: ${sentiment.score}/100
- Trend: ${sentiment.trend}
- Positive mentions: ${sentiment.positive}
- Negative mentions: ${sentiment.negative}
- Neutral mentions: ${sentiment.neutral}

SAMPLE TWEETS:
${topTweets}

Provide a brief 2-3 sentence summary of the current social sentiment. Be specific about what's driving the sentiment and any notable patterns. Do not use emojis.`;

  try {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: "You are Vortia AI, a social sentiment analyst for cryptocurrency markets. Provide concise, data-driven insights." },
        { role: "user", content: prompt }
      ],
    });

    const content = result.choices[0]?.message?.content;
    if (typeof content === "string") {
      return content;
    }
    return "Social sentiment is currently mixed with moderate activity across major cryptocurrencies.";
  } catch (error) {
    console.error("LLM error:", error);
    return "Social sentiment is currently mixed with moderate activity across major cryptocurrencies.";
  }
}

export const socialRouter = router({
  // Get recent tweets/mentions
  getTweets: publicProcedure
    .input(z.object({
      coin: z.string().optional(),
      limit: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      const tweets = generateMockTweets(input.limit, input.coin);
      const sentiment = calculateAggregateSentiment(tweets);
      
      return {
        tweets,
        sentiment,
      };
    }),

  // Get AI-generated social sentiment summary
  getSentimentSummary: publicProcedure
    .input(z.object({
      coin: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const tweets = generateMockTweets(30, input.coin);
      const sentiment = calculateAggregateSentiment(tweets);
      const summary = await generateSocialSummary(tweets, input.coin);

      return {
        summary,
        sentiment,
        tweetCount: tweets.length,
        timeRange: "24h",
      };
    }),

  // Get trending topics
  getTrendingTopics: publicProcedure.query(async () => {
    // Simulated trending topics
    const topics = [
      { tag: "#Bitcoin", mentions: 45200, change: 12.5 },
      { tag: "#Ethereum", mentions: 32100, change: 8.3 },
      { tag: "#Solana", mentions: 18500, change: 25.7 },
      { tag: "#DeFi", mentions: 12300, change: -3.2 },
      { tag: "#NFTs", mentions: 8900, change: -8.1 },
      { tag: "#AI", mentions: 15600, change: 45.2 },
      { tag: "#VortiaAI", mentions: 2400, change: 120.5 },
      { tag: "#Altcoins", mentions: 9800, change: 5.4 },
    ];

    return topics.sort((a, b) => b.mentions - a.mentions);
  }),
});
