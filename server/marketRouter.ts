import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

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

// Pre-written AI insight templates per coin, dynamically adjusted by price action
const COIN_INSIGHTS: Record<string, { bullish: string; bearish: string; neutral: string }> = {
  "bitcoin": {
    bullish: "Vortia Neural Network detects strong bullish momentum for Bitcoin. On-chain accumulation by long-term holders is accelerating, and exchange reserves continue to decline — a historically positive supply signal. Short-term outlook favors continued upside with key resistance levels being tested.",
    bearish: "Vortia Neural Network identifies bearish pressure building on Bitcoin. Elevated exchange inflows and declining open interest suggest profit-taking among institutional participants. Caution is warranted as support levels face increased selling pressure in the near term.",
    neutral: "Vortia Neural Network observes Bitcoin consolidating within a defined range. On-chain metrics show balanced accumulation and distribution, indicating market indecision. A breakout in either direction is likely as volatility compression reaches critical levels."
  },
  "ethereum": {
    bullish: "Vortia Neural Network flags bullish divergence on Ethereum. Rising Layer 2 adoption and increasing ETH staking rates are reducing circulating supply. Network activity metrics and gas consumption trends point to sustained demand growth.",
    bearish: "Vortia Neural Network detects weakening momentum for Ethereum. DeFi TVL contraction and reduced gas fees suggest declining network utilization. The ETH/BTC ratio is under pressure, signaling potential underperformance in the near term.",
    neutral: "Vortia Neural Network shows Ethereum in a consolidation phase. Staking inflows remain steady while DeFi activity holds at baseline levels. Market participants appear to be awaiting a catalyst before committing to directional positions."
  },
  "solana": {
    bullish: "Vortia Neural Network identifies strong bullish signals for Solana. Transaction throughput and active addresses are hitting new highs, reflecting genuine ecosystem growth. Developer activity and DeFi expansion on the network continue to attract capital inflows.",
    bearish: "Vortia Neural Network flags risk signals for Solana. Network congestion events and validator concentration remain concerns. Declining NFT volumes and memecoin activity suggest a cooling of speculative interest on the chain.",
    neutral: "Vortia Neural Network observes Solana maintaining steady network metrics. Transaction volumes are stable with consistent validator performance. The ecosystem is in a building phase with several upcoming protocol launches that could serve as catalysts."
  },
  "binancecoin": {
    bullish: "Vortia Neural Network detects positive momentum for BNB. Increased BNB Chain activity and quarterly token burns are creating favorable supply dynamics. Exchange utility demand and launchpad participation remain strong growth drivers.",
    bearish: "Vortia Neural Network identifies headwinds for BNB. Regulatory scrutiny and declining DEX volumes on BNB Chain are weighing on sentiment. Competitive pressure from alternative L1s is impacting market share metrics.",
    neutral: "Vortia Neural Network shows BNB trading in equilibrium. Burn mechanics continue to reduce supply while exchange volumes remain consistent. The token is closely tracking broader market movements with limited independent catalysts."
  },
  "ripple": {
    bullish: "Vortia Neural Network flags bullish developments for XRP. Cross-border payment adoption is expanding with new institutional partnerships. Regulatory clarity improvements and increasing ODL corridor volumes are strengthening the fundamental outlook.",
    bearish: "Vortia Neural Network detects selling pressure on XRP. Large wallet distributions and declining payment volumes suggest reduced institutional confidence. Competitive CBDC developments pose a longer-term headwind to the payments narrative.",
    neutral: "Vortia Neural Network observes XRP in a holding pattern. Payment corridor volumes are stable while the regulatory landscape continues to evolve. Market participants are positioning cautiously ahead of key legal and partnership developments."
  },
  "cardano": {
    bullish: "Vortia Neural Network identifies improving fundamentals for Cardano. Smart contract deployment is accelerating post-Hydra upgrades, and staking participation remains among the highest in the industry. Governance improvements are attracting institutional interest.",
    bearish: "Vortia Neural Network flags declining momentum for Cardano. DApp adoption metrics lag behind competing L1 platforms, and developer activity has plateaued. TVL growth remains modest relative to ecosystem development spending.",
    neutral: "Vortia Neural Network shows Cardano in a development-focused phase. Protocol upgrades are progressing on schedule while staking yields remain attractive. The market is awaiting measurable DApp adoption growth before repricing the asset."
  },
  "dogecoin": {
    bullish: "Vortia Neural Network detects surging social sentiment for Dogecoin. Whale accumulation patterns and increasing merchant adoption are providing fundamental support beyond meme-driven speculation. Community engagement metrics are at elevated levels.",
    bearish: "Vortia Neural Network identifies fading momentum for Dogecoin. Social media mention volumes are declining and large holder positions are being reduced. Without fundamental utility catalysts, the token faces downside risk from sentiment shifts.",
    neutral: "Vortia Neural Network observes Dogecoin consolidating with stable community engagement. Payment integration efforts continue while social sentiment remains baseline positive. Price action is closely correlated with broader meme coin market dynamics."
  },
  "avalanche-2": {
    bullish: "Vortia Neural Network flags bullish subnet activity on Avalanche. Institutional subnet deployments and gaming ecosystem growth are driving unique value propositions. Cross-chain bridge volumes and DeFi TVL are trending upward.",
    bearish: "Vortia Neural Network detects competitive pressure on Avalanche. Subnet adoption is below projections and DeFi activity is migrating to alternative chains. Token unlock schedules may create additional supply-side headwinds.",
    neutral: "Vortia Neural Network shows Avalanche maintaining its subnet infrastructure advantage. Enterprise partnerships continue to develop while DeFi metrics hold steady. The ecosystem is positioning for the next wave of institutional blockchain adoption."
  },
  "polkadot": {
    bullish: "Vortia Neural Network identifies growing parachain ecosystem activity on Polkadot. Cross-chain message passing volumes are increasing, validating the interoperability thesis. Governance participation and staking rates reflect strong community conviction.",
    bearish: "Vortia Neural Network flags underperformance risks for Polkadot. Parachain slot demand has softened and developer migration to competing ecosystems is a concern. The DOT/BTC ratio suggests relative weakness in the current market cycle.",
    neutral: "Vortia Neural Network observes Polkadot in a technical development phase. Parachain upgrades and XCM improvements are progressing while market valuation consolidates. Interoperability narratives may strengthen as multi-chain adoption accelerates."
  },
  "tron": {
    bullish: "Vortia Neural Network detects strong stablecoin flow metrics on TRON. The network dominates USDT transfer volume with consistently low fees, driving organic demand for TRX. Revenue generation and burn rates are creating deflationary pressure.",
    bearish: "Vortia Neural Network identifies concentration risks for TRON. Heavy reliance on stablecoin transfers and limited DApp diversity create vulnerability to regulatory changes. Network decentralization metrics remain a point of concern.",
    neutral: "Vortia Neural Network shows TRON maintaining its stablecoin infrastructure dominance. Transaction volumes are consistent with steady network revenue generation. The ecosystem continues to serve as a primary rail for emerging market value transfer."
  },
  "chainlink": {
    bullish: "Vortia Neural Network flags expanding oracle adoption for Chainlink. CCIP cross-chain protocol integration is accelerating across major DeFi platforms. Staking v2 participation and data feed deployments signal growing network utility and demand.",
    bearish: "Vortia Neural Network detects competitive pressure on Chainlink. Alternative oracle solutions are gaining market share while LINK token velocity remains elevated. The gap between protocol revenue and token valuation warrants monitoring.",
    neutral: "Vortia Neural Network observes Chainlink solidifying its oracle infrastructure position. CCIP adoption is progressing steadily while staking yields attract long-term holders. The token is trading in line with broader DeFi sector performance."
  },
  "matic-network": {
    bullish: "Vortia Neural Network identifies positive migration signals for Polygon. The POL token transition and zkEVM adoption are creating renewed ecosystem interest. Enterprise partnerships and gaming integrations continue to expand the user base.",
    bearish: "Vortia Neural Network flags transition risks for Polygon. The MATIC to POL migration creates uncertainty while L2 competition intensifies from Arbitrum and Optimism. TVL retention during the transition period is a key metric to watch.",
    neutral: "Vortia Neural Network shows Polygon navigating its token migration phase. zkEVM performance metrics are improving while the ecosystem adapts to the POL transition. Market pricing reflects the uncertainty inherent in major protocol upgrades."
  },
  "uniswap": {
    bullish: "Vortia Neural Network detects rising DEX volumes favoring Uniswap. Multi-chain deployment expansion and the fee switch governance proposal are catalyzing renewed interest. Protocol revenue growth and LP activity indicate healthy market-making dynamics.",
    bearish: "Vortia Neural Network identifies volume share erosion for Uniswap. Competing DEX aggregators and intent-based trading systems are capturing an increasing share of swap volume. Fee switch uncertainty continues to weigh on token valuation.",
    neutral: "Vortia Neural Network observes Uniswap maintaining its position as the leading DEX by TVL. Multi-chain volumes are stable while governance discussions around fee distribution continue. The protocol remains a bellwether for broader DeFi sector health."
  },
  "aave": {
    bullish: "Vortia Neural Network flags strong lending metrics for Aave. Total deposits and borrow utilization rates are climbing across multiple chains, reflecting genuine DeFi demand. GHO stablecoin adoption and safety module staking provide additional revenue streams.",
    bearish: "Vortia Neural Network detects risk factors for Aave. Declining borrow rates and increased competition from newer lending protocols are compressing margins. Bad debt exposure from volatile collateral types requires ongoing monitoring.",
    neutral: "Vortia Neural Network shows Aave maintaining its lending protocol dominance. Cross-chain deployment strategy is diversifying risk while GHO supply grows steadily. The protocol's risk management track record continues to attract institutional depositors."
  },
  "lido-dao": {
    bullish: "Vortia Neural Network identifies growing liquid staking demand benefiting Lido. stETH adoption across DeFi protocols and increasing validator count strengthen the network effect. Lido's market share in ETH staking reflects strong protocol-market fit.",
    bearish: "Vortia Neural Network flags decentralization concerns for Lido. Regulatory scrutiny of liquid staking derivatives and growing competition from distributed alternatives pose risks. Governance token dilution from ongoing incentive programs warrants attention.",
    neutral: "Vortia Neural Network observes Lido maintaining its liquid staking leadership position. stETH integration across DeFi remains robust while the protocol navigates decentralization improvements. Staking yield dynamics continue to drive steady demand."
  },
  "arbitrum": {
    bullish: "Vortia Neural Network detects accelerating L2 adoption on Arbitrum. Transaction volumes and unique addresses are reaching new highs, with DeFi TVL growth outpacing competing rollups. The Orbit chain framework is attracting new ecosystem builders.",
    bearish: "Vortia Neural Network identifies token unlock pressure for Arbitrum. Large vesting schedules and DAO treasury distributions are creating supply headwinds. Competition from Base and other L2s is fragmenting the rollup market share.",
    neutral: "Vortia Neural Network shows Arbitrum as the leading L2 by TVL and transaction count. Ecosystem development continues at a steady pace while the market digests ongoing token distributions. Sequencer revenue trends provide insight into organic demand."
  },
  "optimism": {
    bullish: "Vortia Neural Network flags growing Superchain adoption for Optimism. The OP Stack is becoming the default L2 framework with major deployments from Coinbase and others. Retroactive public goods funding is creating a unique ecosystem flywheel.",
    bearish: "Vortia Neural Network detects valuation pressure on Optimism. Token inflation from grants and incentive programs is diluting holders while Superchain revenue sharing models remain unproven. L2 competition continues to intensify.",
    neutral: "Vortia Neural Network observes Optimism executing its Superchain vision steadily. OP Stack adoption is progressing while the protocol balances growth incentives with token economics. The collective governance model is a differentiating factor in the L2 landscape."
  },
  "cosmos": {
    bullish: "Vortia Neural Network identifies renewed IBC activity across the Cosmos ecosystem. Inter-chain transaction volumes and new chain deployments using the Cosmos SDK are accelerating. ATOM's role as the interchain security hub is gaining traction.",
    bearish: "Vortia Neural Network flags value accrual concerns for Cosmos Hub. Despite ecosystem growth, ATOM's economic model faces challenges in capturing value from sovereign chains. Competing interoperability solutions are challenging the IBC narrative.",
    neutral: "Vortia Neural Network shows the Cosmos ecosystem expanding while ATOM valuation consolidates. IBC volumes remain healthy and new appchains continue to launch. The interchain security model is being tested and refined through real-world adoption."
  },
  "near": {
    bullish: "Vortia Neural Network detects strong developer growth metrics for NEAR Protocol. Chain abstraction technology and AI integration initiatives are positioning NEAR at the frontier of Web3 UX innovation. Active account growth and transaction volumes reflect genuine adoption.",
    bearish: "Vortia Neural Network identifies competitive challenges for NEAR Protocol. Despite technical innovation, DApp ecosystem depth lags behind established L1 platforms. Token distribution from early investor unlocks may create near-term supply pressure.",
    neutral: "Vortia Neural Network observes NEAR Protocol advancing its chain abstraction roadmap. Developer tools and AI integration efforts are differentiating the platform while ecosystem metrics grow steadily. Market valuation reflects the early stage of adoption relative to technical capability."
  },
  "aptos": {
    bullish: "Vortia Neural Network flags rising DeFi activity on Aptos. Move language advantages and institutional-grade performance are attracting capital and developers. Transaction throughput and finality metrics position Aptos competitively among next-gen L1s.",
    bearish: "Vortia Neural Network detects ecosystem maturity challenges for Aptos. TVL growth has plateaued relative to competing chains and token unlock schedules create ongoing supply pressure. Developer ecosystem depth remains a work in progress.",
    neutral: "Vortia Neural Network shows Aptos building foundational infrastructure with steady progress. Move language adoption is growing while the DeFi ecosystem expands methodically. Performance benchmarks remain strong but market valuation awaits broader adoption proof points."
  },
  "sui": {
    bullish: "Vortia Neural Network identifies surging ecosystem metrics for Sui. Object-centric architecture is enabling novel DeFi and gaming applications, driving unique address growth. Developer grants and hackathon participation signal a healthy builder pipeline.",
    bearish: "Vortia Neural Network flags token distribution concerns for Sui. Significant insider holdings and vesting schedules create supply overhang risks. Ecosystem TVL remains modest relative to market capitalization, suggesting speculative premium.",
    neutral: "Vortia Neural Network observes Sui's technical architecture attracting developer interest. The Move-based ecosystem is growing while the network demonstrates consistent performance metrics. Market pricing reflects both the potential and the early-stage risks of the platform."
  },
  "fantom": {
    bullish: "Vortia Neural Network detects positive momentum from Fantom's Sonic upgrade. The high-performance EVM chain is attracting DeFi protocols seeking speed and low costs. Andre Cronje's continued involvement provides a unique developer ecosystem advantage.",
    bearish: "Vortia Neural Network identifies migration risks for Fantom. The transition to Sonic chain creates uncertainty for existing ecosystem participants. Competition from established L2s and alternative L1s is challenging Fantom's market positioning.",
    neutral: "Vortia Neural Network shows Fantom navigating its Sonic chain evolution. The upgrade promises significant performance improvements while the existing ecosystem maintains baseline activity. Market participants are evaluating the migration timeline and execution risk."
  },
  "algorand": {
    bullish: "Vortia Neural Network flags institutional adoption signals for Algorand. Real-world asset tokenization partnerships and government blockchain initiatives are validating the enterprise focus. Pure proof-of-stake efficiency and instant finality attract compliance-focused applications.",
    bearish: "Vortia Neural Network detects declining retail engagement with Algorand. DeFi ecosystem activity remains limited compared to competing platforms, and developer mindshare has shifted to more active ecosystems. Token price has underperformed the broader market cycle.",
    neutral: "Vortia Neural Network observes Algorand maintaining its institutional blockchain positioning. RWA tokenization and government partnerships continue to develop while retail DeFi metrics remain modest. The protocol's technical capabilities await broader market adoption."
  },
  "fetch-ai": {
    bullish: "Vortia Neural Network identifies strong AI narrative momentum for FET. The Artificial Superintelligence Alliance merger is creating a unified AI-blockchain platform with significant mindshare. Agent-based computing demand and partnership announcements are driving accumulation.",
    bearish: "Vortia Neural Network flags execution risks for FET. The ASI merger integration complexity and AI narrative dependency create vulnerability to sentiment shifts. Token economics post-merger require careful evaluation as supply dynamics change.",
    neutral: "Vortia Neural Network shows FET positioned at the intersection of AI and blockchain narratives. The ASI Alliance is progressing through integration milestones while the market evaluates real utility versus speculative premium. Agent computing adoption metrics will be key to watch."
  },
  "render-token": {
    bullish: "Vortia Neural Network detects growing GPU compute demand benefiting Render. Decentralized rendering workloads are increasing as AI and 3D content creation expand. Network utilization metrics and burn rates indicate genuine protocol-market fit.",
    bearish: "Vortia Neural Network identifies competitive pressure on Render. Centralized GPU cloud providers and alternative decentralized compute networks are expanding rapidly. Token velocity and the gap between network revenue and market cap warrant scrutiny.",
    neutral: "Vortia Neural Network observes Render maintaining its position in decentralized GPU computing. Rendering workload volumes are stable while the AI compute narrative provides tailwind. The protocol's long-term value depends on sustained growth in decentralized compute demand."
  },
  "injective-protocol": {
    bullish: "Vortia Neural Network flags accelerating DeFi innovation on Injective. The fully on-chain orderbook and cross-chain derivatives are attracting sophisticated trading activity. Burn auction mechanics and deflationary tokenomics create favorable supply dynamics.",
    bearish: "Vortia Neural Network detects liquidity concentration risks on Injective. Trading volumes are dominated by a small number of pairs and market makers. Ecosystem breadth remains narrow compared to general-purpose DeFi platforms.",
    neutral: "Vortia Neural Network shows Injective carving a niche in on-chain derivatives trading. Burn mechanics continue to reduce supply while trading volumes maintain baseline levels. The protocol's specialized focus differentiates it but also limits its addressable market."
  },
  "the-graph": {
    bullish: "Vortia Neural Network identifies growing indexing demand for The Graph. Subgraph deployments and query volumes are increasing as Web3 application complexity grows. The migration to a decentralized network and multi-chain expansion strengthen the protocol's infrastructure role.",
    bearish: "Vortia Neural Network flags monetization challenges for The Graph. Free query tiers and competing indexing solutions are limiting revenue growth. Token inflation from indexer rewards creates ongoing dilution pressure for GRT holders.",
    neutral: "Vortia Neural Network observes The Graph serving as critical Web3 infrastructure. Query volumes reflect steady DApp ecosystem activity while the decentralized network migration progresses. GRT tokenomics balance indexer incentives with long-term value accrual."
  },
  "shiba-inu": {
    bullish: "Vortia Neural Network detects renewed community momentum for Shiba Inu. Shibarium L2 transaction growth and burn rate acceleration are adding utility beyond meme status. Ecosystem expansion into metaverse and DeFi applications is diversifying the value proposition.",
    bearish: "Vortia Neural Network identifies fading speculative interest in Shiba Inu. Shibarium adoption metrics remain modest while competing meme coins capture market attention. The massive token supply creates structural headwinds for meaningful price appreciation.",
    neutral: "Vortia Neural Network shows Shiba Inu maintaining its position as a leading meme ecosystem. Shibarium activity provides baseline utility while community engagement remains consistent. Price action continues to be driven primarily by broader meme coin market sentiment."
  },
  "pepe": {
    bullish: "Vortia Neural Network flags surging social metrics for PEPE. Whale accumulation patterns and exchange listing expansion are providing liquidity depth. Cultural memetic momentum and community growth metrics indicate sustained retail interest.",
    bearish: "Vortia Neural Network detects declining social engagement for PEPE. Trading volumes are contracting from peak levels and large holder distributions suggest profit-taking. Without fundamental utility, the token is vulnerable to rapid sentiment reversals.",
    neutral: "Vortia Neural Network observes PEPE maintaining baseline community engagement. Trading volumes have normalized from speculative peaks while the token retains cultural relevance. Price dynamics remain closely tied to broader meme coin market cycles."
  },
  "bonk": {
    bullish: "Vortia Neural Network identifies strong Solana ecosystem synergy for BONK. Integration across Solana DeFi protocols and increasing utility as a community token are driving demand. Social sentiment metrics and holder distribution patterns suggest organic growth.",
    bearish: "Vortia Neural Network flags concentration and volatility risks for BONK. Meme coin market rotations and declining novelty factor pose challenges. Token supply dynamics and whale activity create potential for sharp price dislocations.",
    neutral: "Vortia Neural Network shows BONK established as Solana's primary meme token. Ecosystem integrations provide baseline utility while community engagement remains active. Performance is closely correlated with Solana ecosystem sentiment and broader meme coin trends."
  },
  "vortia-ai": {
    bullish: "Vortia Neural Network confirms strong bullish signals for VAI. Platform query volumes are surging as AI-powered sentiment analysis gains adoption among institutional and retail traders. The neural network's accuracy metrics continue to improve, driving organic demand for VAI utility tokens.",
    bearish: "Vortia Neural Network identifies a temporary cooling period for VAI. Market-wide risk-off sentiment is affecting AI token valuations broadly. However, platform fundamentals remain strong with consistent query growth and expanding oracle coverage.",
    neutral: "Vortia Neural Network shows VAI in an accumulation phase with steady platform growth. Daily AI query volumes exceed 2.4M with expanding coverage across 31 tracked assets. The sentiment oracle's track record is building institutional credibility and long-term demand."
  }
};

// Generate AI sentiment analysis for a coin using pre-written dynamic insights
function generateSentimentAnalysis(coinId: string, coinName: string, price: number, change24h: number, marketCap: number): string {
  const insights = COIN_INSIGHTS[coinId];
  
  if (!insights) {
    // Generic fallback for any unmapped coin
    if (change24h > 2) {
      return `Vortia Neural Network detects bullish momentum for ${coinName}. Price action shows a ${change24h.toFixed(1)}% gain over 24 hours with increasing market participation. On-chain signals and social sentiment metrics are trending positive, suggesting continued upside potential.`;
    } else if (change24h < -2) {
      return `Vortia Neural Network identifies bearish pressure on ${coinName}. The ${Math.abs(change24h).toFixed(1)}% decline reflects broader risk-off sentiment with elevated selling activity. Key support levels should be monitored for potential stabilization signals.`;
    } else {
      return `Vortia Neural Network observes ${coinName} in a consolidation phase. Price movement of ${change24h.toFixed(1)}% indicates market equilibrium with balanced buying and selling pressure. Volatility compression suggests a directional move may be approaching.`;
    }
  }

  // Select insight based on 24h price change
  if (change24h > 2) {
    return insights.bullish;
  } else if (change24h < -2) {
    return insights.bearish;
  } else {
    return insights.neutral;
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
    .query(({ input }) => {
      const analysis = generateSentimentAnalysis(
        input.coinId,
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
