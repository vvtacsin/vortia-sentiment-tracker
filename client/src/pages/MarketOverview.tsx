import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Loader2,
  PieChart,
  Gauge,
  Flame,
  Snowflake,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import type { Asset } from "@shared/marketTypes";
import { AppSidebar } from "@/components/AppSidebar";

// Sector data with colors
const sectorData = [
  { name: "Layer 1", value: 45, color: "#14B8A6", coins: ["BTC", "ETH", "SOL", "ADA", "AVAX"] },
  { name: "DeFi", value: 22, color: "#8B5CF6", coins: ["UNI", "AAVE", "LINK", "MKR"] },
  { name: "Layer 2", value: 15, color: "#F59E0B", coins: ["MATIC", "ARB", "OP"] },
  { name: "Meme", value: 10, color: "#EF4444", coins: ["DOGE", "SHIB", "PEPE"] },
  { name: "AI", value: 8, color: "#3B82F6", coins: ["FET", "RNDR", "AGIX"] },
];

export default function MarketOverview() {
  const [fearGreedIndex, setFearGreedIndex] = useState(52);
  const [fearGreedLabel, setFearGreedLabel] = useState("Neutral");

  // Fetch market data
  const { data: assets, isLoading: assetsLoading } = trpc.market.getAssets.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const { data: globalStats } = trpc.market.getGlobalStats.useQuery(undefined, {
    refetchInterval: 60000,
  });

  // Simulate fear/greed index updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * 30) + 40; // 40-70 range
      setFearGreedIndex(newIndex);
      if (newIndex < 25) setFearGreedLabel("Extreme Fear");
      else if (newIndex < 45) setFearGreedLabel("Fear");
      else if (newIndex < 55) setFearGreedLabel("Neutral");
      else if (newIndex < 75) setFearGreedLabel("Greed");
      else setFearGreedLabel("Extreme Greed");
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate top gainers and losers
  const sortedAssets = assets ? [...assets].sort((a: Asset, b: Asset) => (b.change24h || 0) - (a.change24h || 0)) : [];
  const topGainers = sortedAssets.slice(0, 5);
  const topLosers = sortedAssets.slice(-5).reverse();

  // Market dominance data
  const dominanceData = assets?.slice(0, 5).map((asset: Asset) => ({
    name: asset.symbol,
    value: asset.marketCap ? Math.round((asset.marketCap / (globalStats?.totalMarketCap || 1)) * 100) : 0,
  })) || [];

  const getFearGreedColor = (value: number) => {
    if (value < 25) return "text-red-500";
    if (value < 45) return "text-orange-400";
    if (value < 55) return "text-yellow-400";
    if (value < 75) return "text-green-400";
    return "text-green-500";
  };

  return (
    <AppSidebar searchPlaceholder="Search markets..." statusText="Neural Network Active">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70">Real-Time Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Market <span className="gradient-text">Overview</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              Comprehensive market analysis powered by Vortia AI. Track sectors, sentiment, and market movements in real-time.
            </p>
          </div>
          <div className="flex gap-4">
            <Card className="bg-white/5 border-white/10 px-4 py-3 stat-accent-teal">
              <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Market Cap</div>
              <div className="text-xl font-display font-bold text-white">
                ${globalStats?.totalMarketCap ? (globalStats.totalMarketCap / 1e12).toFixed(2) : "2.8"}T
              </div>
            </Card>
            <Card className="bg-white/5 border-white/10 px-4 py-3 stat-accent-purple">
              <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">24h Volume</div>
              <div className="text-xl font-display font-bold text-white">
                ${globalStats?.totalVolume24h ? (globalStats.totalVolume24h / 1e9).toFixed(0) : "95"}B
              </div>
            </Card>
          </div>
        </div>

        {/* Fear & Greed + Sector Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Fear & Greed Index */}
          <Card className="glass-panel">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" />
                Fear & Greed Index
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative w-48 h-24 mb-4">
                {/* Gauge Background */}
                <div className="absolute inset-0 rounded-t-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-30"></div>
                </div>
                {/* Gauge Needle */}
                <div 
                  className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom transition-transform duration-1000"
                  style={{ transform: `translateX(-50%) rotate(${(fearGreedIndex / 100) * 180 - 90}deg)` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className={`text-5xl font-display font-bold ${getFearGreedColor(fearGreedIndex)}`}>
                {fearGreedIndex}
              </div>
              <div className="text-lg font-medium text-white mt-2">{fearGreedLabel}</div>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Snowflake className="w-4 h-4 text-blue-400" />
                  Fear
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Greed
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Sector Breakdown */}
          <Card className="glass-panel lg:col-span-2">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Sector Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {sectorData.map((sector) => (
                    <div key={sector.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                        <span className="font-medium">{sector.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {sector.coins.slice(0, 3).join(", ")}
                        </div>
                        <Badge variant="outline" className="bg-white/5">{sector.value}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Gainers */}
          <Card className="glass-panel">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Top Gainers (24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              {assetsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <table className="vortia-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Asset</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">24h Change</th>
                      <th className="text-right hidden md:table-cell">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                  {topGainers.map((asset, index) => (
                    <tr key={asset.id}>
                      <td className="text-muted-foreground font-bold w-8">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                            {asset.image ? (
                              <img src={asset.image} alt={asset.symbol} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold">{asset.symbol[0]}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs">{asset.name}</div>
                            <div className="text-[10px] text-muted-foreground">{asset.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-mono text-xs">${(asset.price || 0).toLocaleString()}</td>
                      <td className="text-right">
                        <span className="text-green-400 text-xs flex items-center justify-end gap-0.5">
                          <ArrowUpRight className="w-3 h-3" />
                          +{(asset.change24h || 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right font-mono text-xs text-muted-foreground hidden md:table-cell">
                        {asset.marketCap ? `$${(asset.marketCap / 1e9).toFixed(1)}B` : '—'}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card className="glass-panel">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                Top Losers (24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              {assetsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <table className="vortia-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Asset</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">24h Change</th>
                      <th className="text-right hidden md:table-cell">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                  {topLosers.map((asset, index) => (
                    <tr key={asset.id}>
                      <td className="text-muted-foreground font-bold w-8">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                            {asset.image ? (
                              <img src={asset.image} alt={asset.symbol} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold">{asset.symbol[0]}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs">{asset.name}</div>
                            <div className="text-[10px] text-muted-foreground">{asset.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-mono text-xs">${(asset.price || 0).toLocaleString()}</td>
                      <td className="text-right">
                        <span className="text-red-400 text-xs flex items-center justify-end gap-0.5">
                          <ArrowDownRight className="w-3 h-3" />
                          {(asset.change24h || 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right font-mono text-xs text-muted-foreground hidden md:table-cell">
                        {asset.marketCap ? `$${(asset.marketCap / 1e9).toFixed(1)}B` : '—'}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Market Dominance */}
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Market Dominance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dominanceData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8' }} width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Dominance']}
                  />
                  <Bar dataKey="value" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppSidebar>
  );
}
