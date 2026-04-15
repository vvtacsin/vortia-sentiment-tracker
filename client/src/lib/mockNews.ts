export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  url: string;
}

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: "SEC Approves New Crypto ETF Framework, Signaling Institutional Adoption",
    source: "CoinDesk",
    time: "10m ago",
    sentiment: "positive",
    url: "#"
  },
  {
    id: '2',
    title: "Major Protocol Upgrade Scheduled for Next Week: What You Need to Know",
    source: "CryptoSlate",
    time: "45m ago",
    sentiment: "neutral",
    url: "#"
  },
  {
    id: '3',
    title: "Market Volatility Spikes as Central Banks Announce Rate Decisions",
    source: "Bloomberg Crypto",
    time: "1h ago",
    sentiment: "negative",
    url: "#"
  },
  {
    id: '4',
    title: "Vortia AI Partners with Leading DeFi Protocol for Oracle Integration",
    source: "Vortia Blog",
    time: "2h ago",
    sentiment: "positive",
    url: "#"
  },
  {
    id: '5',
    title: "Analysis: Why AI Tokens Are Outperforming the Broader Market in Q1",
    source: "The Block",
    time: "3h ago",
    sentiment: "positive",
    url: "#"
  }
];
