export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  price: string;
  category: 'DeFi' | 'Trading' | 'Security' | 'NFT';
  rating: number;
  users: number;
  tags: string[];
}

export const mockModels: AIModel[] = [
  // === TRADING MODELS ===
  {
    id: '1',
    name: "Vortia Sentiment Oracle V2",
    provider: "Vortia Labs",
    description: "Advanced sentiment analysis model trained on 50M+ crypto-related social posts and news articles. Provides real-time bullish/bearish signals with 87% accuracy.",
    price: "0.5 VAI / call",
    category: "Trading",
    rating: 4.9,
    users: 12500,
    tags: ["Sentiment", "Social", "Real-time"]
  },
  {
    id: '5',
    name: "Whale Watcher Pro",
    provider: "DeepSea Analytics",
    description: "On-chain analysis tool that tracks large wallet movements and predicts market impact. Alerts you to potential dumps or accumulation phases before they happen.",
    price: "5.0 VAI / month",
    category: "Trading",
    rating: 4.6,
    users: 9800,
    tags: ["On-chain", "Whales", "Alerts"]
  },
  {
    id: '6',
    name: "Macro Trend Predictor",
    provider: "GlobalFin AI",
    description: "Correlates traditional finance metrics (S&P 500, DXY, Interest Rates) with crypto markets to forecast long-term trend reversals with institutional-grade accuracy.",
    price: "3.0 VAI / call",
    category: "Trading",
    rating: 4.4,
    users: 4200,
    tags: ["Macro", "Forecasting", "TradFi"]
  },
  {
    id: '7',
    name: "Alpha Signal Generator",
    provider: "QuantumEdge",
    description: "Machine learning model that identifies alpha opportunities by analyzing order book depth, funding rates, and liquidation cascades across major exchanges.",
    price: "8.0 VAI / day",
    category: "Trading",
    rating: 4.7,
    users: 6300,
    tags: ["Alpha", "Order Book", "Liquidations"]
  },
  {
    id: '8',
    name: "Momentum Scanner X",
    provider: "TrendHunter AI",
    description: "Real-time momentum detection across 500+ trading pairs. Identifies breakouts, reversals, and continuation patterns using advanced technical analysis.",
    price: "1.0 VAI / call",
    category: "Trading",
    rating: 4.5,
    users: 11200,
    tags: ["Momentum", "Technical", "Breakouts"]
  },
  {
    id: '9',
    name: "Funding Rate Arbitrage Bot",
    provider: "ArbMaster",
    description: "Identifies funding rate arbitrage opportunities between perpetual futures and spot markets. Calculates optimal position sizes and expected returns.",
    price: "2.5 VAI / call",
    category: "Trading",
    rating: 4.3,
    users: 3800,
    tags: ["Arbitrage", "Funding", "Perpetuals"]
  },
  {
    id: '10',
    name: "News Impact Analyzer",
    provider: "CryptoWire AI",
    description: "NLP model that processes breaking news in real-time and predicts price impact within seconds. Covers 200+ news sources and social platforms.",
    price: "1.5 VAI / call",
    category: "Trading",
    rating: 4.6,
    users: 7500,
    tags: ["News", "NLP", "Speed"]
  },
  {
    id: '11',
    name: "Volume Profile Predictor",
    provider: "MarketDepth Labs",
    description: "Predicts high-volume price zones and support/resistance levels using historical volume profile analysis and machine learning.",
    price: "0.8 VAI / call",
    category: "Trading",
    rating: 4.4,
    users: 5100,
    tags: ["Volume", "Support/Resistance", "ML"]
  },

  // === DEFI MODELS ===
  {
    id: '2',
    name: "DeFi Yield Optimizer",
    provider: "YieldMaster AI",
    description: "Predictive model for identifying optimal yield farming strategies across multiple chains. Automatically adjusts for impermanent loss risk and gas costs.",
    price: "2.0 VAI / call",
    category: "DeFi",
    rating: 4.7,
    users: 8200,
    tags: ["Yield", "Multi-chain", "Risk Mgmt"]
  },
  {
    id: '12',
    name: "Liquidity Pool Analyzer",
    provider: "PoolGenius",
    description: "Deep analysis of DEX liquidity pools including TVL trends, fee generation, impermanent loss calculations, and optimal entry/exit timing.",
    price: "1.0 VAI / call",
    category: "DeFi",
    rating: 4.5,
    users: 6700,
    tags: ["Liquidity", "DEX", "IL Calculator"]
  },
  {
    id: '13',
    name: "Lending Rate Oracle",
    provider: "BorrowSmart",
    description: "Tracks and predicts lending/borrowing rates across Aave, Compound, and 20+ protocols. Optimizes your capital efficiency with rate arbitrage alerts.",
    price: "0.5 VAI / call",
    category: "DeFi",
    rating: 4.6,
    users: 9100,
    tags: ["Lending", "Rates", "Arbitrage"]
  },
  {
    id: '14',
    name: "Bridge Risk Assessor",
    provider: "CrossChain Security",
    description: "Evaluates cross-chain bridge security, liquidity depth, and historical reliability. Recommends safest routes for large transfers.",
    price: "3.0 VAI / call",
    category: "DeFi",
    rating: 4.8,
    users: 4500,
    tags: ["Bridges", "Security", "Cross-chain"]
  },
  {
    id: '15',
    name: "Stablecoin Health Monitor",
    provider: "PegWatch",
    description: "Real-time monitoring of stablecoin pegs, collateral ratios, and redemption mechanisms. Early warning system for depeg events.",
    price: "0.3 VAI / call",
    category: "DeFi",
    rating: 4.7,
    users: 12800,
    tags: ["Stablecoins", "Peg", "Risk"]
  },
  {
    id: '16',
    name: "Gas Price Predictor",
    provider: "GasOptimize",
    description: "ML model that predicts Ethereum gas prices 1-24 hours ahead. Helps schedule transactions for optimal cost savings.",
    price: "0.2 VAI / call",
    category: "DeFi",
    rating: 4.4,
    users: 18500,
    tags: ["Gas", "Ethereum", "Optimization"]
  },
  {
    id: '17',
    name: "Protocol Revenue Tracker",
    provider: "DeFi Metrics",
    description: "Tracks real revenue and fee generation across 100+ DeFi protocols. Identifies undervalued projects based on P/E ratios.",
    price: "1.5 VAI / call",
    category: "DeFi",
    rating: 4.5,
    users: 5600,
    tags: ["Revenue", "Fundamentals", "Valuation"]
  },
  {
    id: '18',
    name: "Airdrop Hunter",
    provider: "DropFinder AI",
    description: "Identifies potential airdrop opportunities by analyzing on-chain activity patterns of past successful airdrops. Suggests optimal farming strategies.",
    price: "5.0 VAI / month",
    category: "DeFi",
    rating: 4.3,
    users: 15200,
    tags: ["Airdrops", "Farming", "Alpha"]
  },

  // === SECURITY MODELS ===
  {
    id: '3',
    name: "Smart Contract Auditor",
    provider: "SecureChain",
    description: "Automated vulnerability scanner for Solidity smart contracts. Detects reentrancy, overflow, and logic errors with 99% accuracy.",
    price: "10 VAI / scan",
    category: "Security",
    rating: 4.8,
    users: 5400,
    tags: ["Security", "Audit", "Solidity"]
  },
  {
    id: '19',
    name: "Rug Pull Detector",
    provider: "SafeInvest AI",
    description: "Analyzes token contracts, team wallets, and liquidity locks to identify potential rug pulls before they happen. 94% detection rate.",
    price: "0.5 VAI / call",
    category: "Security",
    rating: 4.9,
    users: 22000,
    tags: ["Rug Pull", "Token Analysis", "Safety"]
  },
  {
    id: '20',
    name: "Wallet Risk Scorer",
    provider: "ChainGuard",
    description: "Assigns risk scores to wallet addresses based on transaction history, known associations, and behavioral patterns. Essential for compliance.",
    price: "0.3 VAI / call",
    category: "Security",
    rating: 4.6,
    users: 8900,
    tags: ["Compliance", "Risk Score", "AML"]
  },
  {
    id: '21',
    name: "Phishing URL Detector",
    provider: "CryptoShield",
    description: "Real-time detection of phishing websites targeting crypto users. Browser extension API available for seamless integration.",
    price: "0.1 VAI / call",
    category: "Security",
    rating: 4.7,
    users: 31000,
    tags: ["Phishing", "Browser", "Protection"]
  },
  {
    id: '22',
    name: "MEV Protection Analyzer",
    provider: "FlashGuard",
    description: "Analyzes transactions for MEV vulnerability and recommends protection strategies. Integrates with Flashbots and other MEV protection services.",
    price: "0.8 VAI / call",
    category: "Security",
    rating: 4.5,
    users: 4200,
    tags: ["MEV", "Flashbots", "Protection"]
  },
  {
    id: '23',
    name: "Honeypot Scanner",
    provider: "TokenSafe",
    description: "Instantly detects honeypot tokens that prevent selling. Analyzes contract code, trading history, and liquidity patterns.",
    price: "0.2 VAI / call",
    category: "Security",
    rating: 4.8,
    users: 28500,
    tags: ["Honeypot", "Scam Detection", "Tokens"]
  },
  {
    id: '24',
    name: "Multi-Sig Analyzer",
    provider: "GnosisScan",
    description: "Audits multi-signature wallet configurations for security best practices. Identifies centralization risks and suggests improvements.",
    price: "5.0 VAI / scan",
    category: "Security",
    rating: 4.6,
    users: 2100,
    tags: ["Multi-sig", "Governance", "Audit"]
  },

  // === NFT MODELS ===
  {
    id: '4',
    name: "NFT Rarity Sniper",
    provider: "PixelMind",
    description: "Computer vision model for analyzing NFT trait rarity and aesthetic value. Predicts potential blue-chip collections before they pump.",
    price: "1.5 VAI / call",
    category: "NFT",
    rating: 4.5,
    users: 3100,
    tags: ["NFT", "Vision", "Rarity"]
  },
  {
    id: '25',
    name: "Floor Price Predictor",
    provider: "NFT Analytics Pro",
    description: "ML model that predicts NFT collection floor prices 24-72 hours ahead based on trading volume, holder distribution, and social sentiment.",
    price: "2.0 VAI / call",
    category: "NFT",
    rating: 4.4,
    users: 5800,
    tags: ["Floor Price", "Prediction", "ML"]
  },
  {
    id: '26',
    name: "Wash Trading Detector",
    provider: "NFT Integrity",
    description: "Identifies wash trading and artificial volume in NFT collections. Essential for due diligence before investing in new projects.",
    price: "1.0 VAI / call",
    category: "NFT",
    rating: 4.7,
    users: 7200,
    tags: ["Wash Trading", "Volume", "Analysis"]
  },
  {
    id: '27',
    name: "Art Style Classifier",
    provider: "ArtVision AI",
    description: "Deep learning model that classifies NFT art styles and identifies derivative works. Helps discover unique artists and avoid copies.",
    price: "0.5 VAI / call",
    category: "NFT",
    rating: 4.3,
    users: 4100,
    tags: ["Art", "Classification", "Originality"]
  },
  {
    id: '28',
    name: "Whale Wallet Tracker (NFT)",
    provider: "BlueChip Watch",
    description: "Tracks NFT purchases by known whale wallets and influencers. Get alerts when smart money enters new collections.",
    price: "3.0 VAI / month",
    category: "NFT",
    rating: 4.6,
    users: 9400,
    tags: ["Whales", "Tracking", "Alpha"]
  },
  {
    id: '29',
    name: "Metadata Analyzer",
    provider: "NFT Deep Dive",
    description: "Extracts and analyzes NFT metadata for hidden traits, reveal mechanics, and roadmap clues. Uncover alpha before the crowd.",
    price: "0.8 VAI / call",
    category: "NFT",
    rating: 4.4,
    users: 3600,
    tags: ["Metadata", "Hidden Traits", "Alpha"]
  },
  {
    id: '30',
    name: "Collection Launch Scorer",
    provider: "MintRadar",
    description: "Evaluates upcoming NFT launches based on team history, community engagement, art quality, and tokenomics. Avoid rugs, find gems.",
    price: "1.5 VAI / call",
    category: "NFT",
    rating: 4.5,
    users: 11300,
    tags: ["Launches", "Due Diligence", "Scoring"]
  }
];
