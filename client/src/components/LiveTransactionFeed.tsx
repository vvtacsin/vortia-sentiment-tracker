import { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Transaction types that the AI Oracle processes
const QUERY_TYPES = [
  { type: "Sentiment Analysis", icon: Brain, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  { type: "Price Prediction", icon: TrendingUp, color: "text-green-400", bgColor: "bg-green-500/10" },
  { type: "Risk Assessment", icon: Shield, color: "text-red-400", bgColor: "bg-red-500/10" },
  { type: "Market Signal", icon: Zap, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  { type: "Portfolio Analysis", icon: Activity, color: "text-blue-400", bgColor: "bg-blue-500/10" },
];

// Crypto assets for realistic queries
const ASSETS = ["BTC", "ETH", "SOL", "ADA", "AVAX", "LINK", "DOT", "MATIC", "UNI", "AAVE"];

// Generate random wallet address
function generateWalletAddress(): string {
  const chars = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Generate random VAI cost
function generateVAICost(): string {
  const costs = ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "5.0", "10.0"];
  return costs[Math.floor(Math.random() * costs.length)];
}

// Generate a random transaction
function generateTransaction() {
  const queryType = QUERY_TYPES[Math.floor(Math.random() * QUERY_TYPES.length)];
  const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
  const wallet = generateWalletAddress();
  const cost = generateVAICost();
  
  return {
    id: Date.now() + Math.random(),
    queryType,
    asset,
    wallet: `${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
    cost,
    timestamp: new Date(),
    status: "completed" as const,
  };
}

interface Transaction {
  id: number;
  queryType: typeof QUERY_TYPES[number];
  asset: string;
  wallet: string;
  cost: string;
  timestamp: Date;
  status: "completed" | "pending";
}

export function LiveTransactionFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalQueries, setTotalQueries] = useState(2847293);
  const [isLive, setIsLive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with some transactions
  useEffect(() => {
    const initial: Transaction[] = [];
    for (let i = 0; i < 5; i++) {
      initial.push(generateTransaction());
    }
    setTransactions(initial);
  }, []);

  // Add new transactions periodically
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newTx = generateTransaction();
      setTransactions(prev => [newTx, ...prev.slice(0, 9)]);
      setTotalQueries(prev => prev + 1);
    }, Math.random() * 2000 + 1500); // Random interval between 1.5-3.5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <Card className="glass-panel h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4 text-primary" />
            Live Oracle Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-xs text-muted-foreground">{isLive ? 'Live' : 'Paused'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            Total Queries Processed
          </div>
          <div className="font-mono text-sm text-primary font-bold">
            {totalQueries.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent ref={containerRef} className="flex-1 overflow-y-auto p-0">
        <div className="divide-y divide-white/5">
          {transactions.map((tx, index) => {
            const Icon = tx.queryType.icon;
            const isNew = index === 0;
            
            return (
              <div 
                key={tx.id}
                className={`
                  p-3 hover:bg-white/5 transition-all duration-300 cursor-pointer
                  ${isNew ? 'animate-in slide-in-from-top-2 fade-in duration-500 bg-primary/5' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${tx.queryType.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${tx.queryType.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white truncate">
                        {tx.queryType.type}
                      </span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-white/5 border-white/10">
                        {tx.asset}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{tx.wallet}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="text-primary font-medium">{tx.cost} VAI</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(tx.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
    </Card>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export default LiveTransactionFeed;
