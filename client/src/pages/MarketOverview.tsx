import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Layers,
  Globe,
  Zap,
  ShieldCheck,
  Menu,
  Search,
  Loader2,
  PieChart,
  Gauge,
  Flame,
  Snowflake,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

// Sidebar Navigation Item
function NavItem({ icon, label, active, badge, href }: { icon: any, label: string, active?: boolean, badge?: string, href?: string }) {
  const content = (
    <div className={`
      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
      ${active 
        ? 'bg-primary/10 text-primary shadow-[0_0_10px_rgba(20,184,166,0.1)]' 
        : 'text-muted-foreground hover:text-white hover:bg-white/5'}
    `}>
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{badge}</Badge>}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return <button className="w-full">{content}</button>;
}

// Sector data with colors
const sectorData = [
  { name: "Layer 1", value: 45, color: "#14B8A6", coins: ["BTC", "ETH", "SOL", "ADA", "AVAX"] },
  { name: "DeFi", value: 22, color: "#8B5CF6", coins: ["UNI", "AAVE", "LINK", "MKR"] },
  { name: "Layer 2", value: 15, color: "#F59E0B", coins: ["MATIC", "ARB", "OP"] },
  { name: "Meme", value: 10, color: "#EF4444", coins: ["DOGE", "SHIB", "PEPE"] },
  { name: "AI", value: 8, color: "#3B82F6", coins: ["FET", "RNDR", "AGIX"] },
];

export default function MarketOverview() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="min-h-screen text-foreground flex overflow-hidden selection:bg-primary/30">
      
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <img src="/vortia-logo.png" alt="Vortia AI" className="h-8 w-auto" />
          </div>

          <div className="px-4 py-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Platform</div>
            <nav className="space-y-1">
              <NavItem icon={<Activity className="w-4 h-4" />} label="Sentiment Tracker" href="/" />
              <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Market Overview" active href="/market" />
              <NavItem icon={<Layers className="w-4 h-4" />} label="AI Models" badge="Beta" href="/marketplace" />
              <NavItem icon={<Globe className="w-4 h-4" />} label="Data Gateway" href="/data-gateway" />
            </nav>
          </div>

          <div className="px-4 py-2 mt-6">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Account</div>
            <nav className="space-y-1">
              <NavItem icon={<ShieldCheck className="w-4 h-4" />} label="Portfolio Risk" href="/portfolio" />
              <NavItem icon={<Zap className="w-4 h-4" />} label="Settings" />
            </nav>
          </div>

          <div className="mt-auto p-6">
            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary">VAI Token</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">+12.4%</Badge>
                </div>
                <div className="text-2xl font-display font-bold">$0.85</div>
                <Button size="sm" className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  Buy VAI
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src="/vortia-logo.png" alt="Vortia AI" className="h-8 w-8 lg:hidden" />
              <div className="hidden md:flex items-center text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                System Operational
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search markets..." 
                className="pl-9 w-64 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-full h-9 text-sm" 
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                  Market <span className="text-primary">Overview</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Comprehensive market analysis powered by Vortia AI. Track sectors, sentiment, and market movements in real-time.
                </p>
              </div>
              <div className="flex gap-4">
                <Card className="bg-white/5 border-white/10 px-4 py-2">
                  <div className="text-xs text-muted-foreground mb-1">Total Market Cap</div>
                  <div className="text-xl font-display font-bold text-white">
                    ${globalStats?.totalMarketCap ? (globalStats.totalMarketCap / 1e12).toFixed(2) : "2.8"}T
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/10 px-4 py-2">
                  <div className="text-xs text-muted-foreground mb-1">24h Volume</div>
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
                      style={{ transform: `translateX(-50%) rotate(${(fearGreedIndex - 50) * 1.8}deg)` }}
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
                <CardContent className="p-4">
                  {assetsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topGainers.map((asset, index) => (
                        <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-green-500/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-5">{index + 1}</span>
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                              {asset.image ? (
                                <img src={asset.image} alt={asset.symbol} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-bold">{asset.symbol[0]}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-sm">{asset.name}</div>
                              <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm">${(asset.price || 0).toLocaleString()}</div>
                            <div className="text-sm text-green-400 flex items-center justify-end">
                              <ArrowUpRight className="w-4 h-4 mr-1" />
                              +{(asset.change24h || 0).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                <CardContent className="p-4">
                  {assetsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topLosers.map((asset, index) => (
                        <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-5">{index + 1}</span>
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                              {asset.image ? (
                                <img src={asset.image} alt={asset.symbol} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-bold">{asset.symbol[0]}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-sm">{asset.name}</div>
                              <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm">${(asset.price || 0).toLocaleString()}</div>
                            <div className="text-sm text-red-400 flex items-center justify-end">
                              <ArrowDownRight className="w-4 h-4 mr-1" />
                              {(asset.change24h || 0).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
        </div>
      </main>
    </div>
  );
}
