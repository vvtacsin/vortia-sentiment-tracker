import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { Asset } from "@shared/marketTypes";
import { SentimentChart } from "@/components/SentimentChart";
import { NewsFeed } from "@/components/NewsFeed";
import { SocialFeed } from "@/components/SocialFeed";
import { LiveTransactionFeed } from "@/components/LiveTransactionFeed";
import Marketplace from "@/pages/Marketplace";
import { Link, useLocation } from "wouter";
import { 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Menu, 
  Cpu, 
  Globe, 
  Zap, 
  BarChart3,
  Layers,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";



export default function Home() {
  // Auth hook for user management
  const { user, isAuthenticated } = useAuth();
  

  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);

  // Fetch real market data from backend
  const { data: assets, isLoading: assetsLoading, error: assetsError } = trpc.market.getAssets.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch global stats
  const { data: globalStats } = trpc.market.getGlobalStats.useQuery(undefined, {
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch user profile (if authenticated)
  const { data: userProfile, refetch: refetchProfile } = trpc.user.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Update wallet mutation
  const updateWalletMutation = trpc.user.updateWallet.useMutation({
    onSuccess: () => {
      refetchProfile();
      setShowPointsAnimation(true);
      setTimeout(() => setShowPointsAnimation(false), 3000);
    },
  });

  // Selected asset from real data
  const selectedAsset = assets?.[selectedAssetIndex] || null;

  // Fetch AI analysis for selected asset
  const { data: aiAnalysis, isLoading: aiLoading } = trpc.market.getAIAnalysis.useQuery(
    {
      coinId: selectedAsset?.id || "",
      coinName: selectedAsset?.name || "",
      price: selectedAsset?.price || 0,
      change24h: selectedAsset?.change24h || 0,
      marketCap: selectedAsset?.marketCap || 0,
    },
    {
      enabled: !!selectedAsset,
      staleTime: 60000, // Cache for 1 minute
    }
  );


  // Simulate live data updates pulse
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
              <NavItem 
                icon={<Activity />} 
                label="Sentiment Tracker" 
                active={currentView === "dashboard"} 
                onClick={() => setCurrentView("dashboard")}
              />
              <NavItem icon={<BarChart3 />} label="Market Overview" href="/market" />
              <NavItem 
                icon={<Layers />} 
                label="AI Models" 
                badge="Beta" 
                href="/marketplace"
              />
              <NavItem icon={<Globe />} label="Data Gateway" href="/data-gateway" />
            </nav>
          </div>

          <div className="px-4 py-2 mt-6">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Account</div>
            <nav className="space-y-1">
              <Link href="/portfolio">
              <NavItem icon={<ShieldCheck />} label="Portfolio Risk" />
              </Link>
              <NavItem icon={<Zap />} label="Settings" />
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
        {/* Mobile Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src="/vortia-logo.png" alt="Vortia AI" className="h-8 w-auto lg:hidden" />
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
                placeholder="Search assets..." 
                className="pl-9 w-64 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-full h-9 text-sm" 
              />
            </div>
            

          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {currentView === "marketplace" ? (
              <Marketplace />
            ) : (
              <>
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                      Market Sentiment <span className="text-primary">Oracle</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                      Real-time AI analysis of social signals, on-chain data, and news sentiment powered by the Vortia Neural Network.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <StatCard 
                      label="Global Sentiment" 
                      value={globalStats?.marketSentiment || 68} 
                      suffix="/100" 
                      trend="up" 
                    />
                    <StatCard 
                      label="AI Queries (24h)" 
                      value={globalStats?.aiQueries24h || "2.4M"} 
                      trend="neutral" 
                    />
                  </div>
                </div>

                {/* Main Analysis Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                  
                  {/* Asset List */}
                  <Card className="glass-panel lg:col-span-1 flex flex-col overflow-hidden h-[480px]">
                    <CardHeader className="pb-2 border-b border-white/5 flex-shrink-0">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Tracked Assets
                        {assetsLoading && <Loader2 className="w-3 h-3 ml-2 inline animate-spin" />}
                      </CardTitle>
                    </CardHeader>
                    <div className="flex-1 overflow-y-scroll px-1.5 py-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(20, 184, 166, 0.3) transparent' }}>
                      {assetsError && (
                        <div className="p-4 text-red-400 text-sm">Failed to load market data</div>
                      )}
                      {assets?.map((asset: Asset, index: number) => (
                        <div 
                          key={asset.id}
                          onClick={() => setSelectedAssetIndex(index)}
                          className={`
                            p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between group
                            ${selectedAssetIndex === index 
                              ? 'bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
                              : 'hover:bg-white/5 border border-transparent'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden ${selectedAssetIndex === index ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-muted-foreground'}`}>
                              {asset.image ? (
                                <img src={asset.image} alt={asset.symbol} className="w-full h-full object-cover" />
                              ) : (
                                asset.symbol[0]
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-xs">{asset.name}</div>
                              <div className="text-[10px] text-muted-foreground">{asset.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-xs">${(asset.price ?? 0).toLocaleString()}</div>
                            <div className={`text-[10px] flex items-center justify-end ${(asset.change24h ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {(asset.change24h ?? 0) >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                              {Math.abs(asset.change24h ?? 0).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* AI Analysis Detail */}
                  <Card className="glass-panel lg:col-span-2 flex flex-col relative overflow-hidden h-[480px]">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    {selectedAsset && (
                      <>
                        <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between pb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                              {selectedAsset.image ? (
                                <img src={selectedAsset.image} alt={selectedAsset.symbol} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-display font-bold text-xl">{selectedAsset.symbol}</span>
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-display">{selectedAsset.name} Analysis</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <span className={`w-1.5 h-1.5 rounded-full ${pulse ? 'bg-primary animate-ping' : 'bg-primary'}`}></span>
                                  Live Oracle Feed
                                </span>
                                <span>•</span>
                                <span>Updated 2s ago</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-1">Sentiment Score</div>
                            <div className="flex items-center justify-end gap-2">
                              <span className={`text-3xl font-display font-bold ${getSentimentColor(selectedAsset.sentimentScore)}`}>
                                {selectedAsset.sentimentScore}
                              </span>
                              <span className="text-sm text-muted-foreground">/100</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-1 p-4 flex flex-col gap-4 overflow-y-scroll" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(20, 184, 166, 0.3) transparent' }}>
                          {/* AI Summary Box */}
                          <div className="bg-black/20 rounded-xl p-5 border border-white/5 relative group">
                            <div className="absolute -left-[1px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-primary to-transparent rounded-r-full"></div>
                            <div className="flex items-start gap-3">
                              <Cpu className="w-5 h-5 text-primary mt-1 shrink-0" />
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">Vortia AI Insight</h4>
                                {aiLoading ? (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Analyzing market data...
                                    </div>
                                  ) : (
                                    <p className="text-sm leading-relaxed text-gray-300">
                                      {aiAnalysis?.analysis || "Powered by Vortia Neural Network \u2014 Initializing..."}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricBox 
                              label="Social Volume" 
                              value={selectedAsset.volume24h ? `$${(selectedAsset.volume24h / 1e9).toFixed(2)}B` : "N/A"} 
                              trend="+12%" 
                            />
                            <MetricBox 
                              label="News Sentiment" 
                              value={selectedAsset.sentimentTrend === 'bullish' ? 'Positive' : selectedAsset.sentimentTrend === 'bearish' ? 'Negative' : 'Neutral'} 
                              color={selectedAsset.sentimentTrend === 'bullish' ? 'text-green-400' : selectedAsset.sentimentTrend === 'bearish' ? 'text-red-400' : 'text-yellow-400'} 
                            />
                            <MetricBox 
                              label="Market Cap" 
                              value={selectedAsset.marketCap ? `$${(selectedAsset.marketCap / 1e9).toFixed(1)}B` : "N/A"} 
                              color="text-blue-400" 
                            />
                          </div>

                          {/* Sentiment Chart */}
                          <div className="bg-white/5 rounded-xl border border-white/5 p-4 relative h-[200px]">
                            <div className="mb-2">
                              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Price & Sentiment Correlation</h3>
                            </div>
                            <div className="h-[140px] w-full">
                              <SentimentChart 
                                data={selectedAsset.history || []} 
                                color={selectedAsset.sentimentTrend === 'bearish' ? '#F43F5E' : '#14B8A6'} 
                              />
                            </div>
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>
                </div>

                {/* Secondary Section: News & Signals */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* News Feed Widget */}
                  <div className="lg:col-span-1 h-[400px]">
                    <NewsFeed />
                  </div>

                  {/* Recent Signals Widget */}
                  <Card className="glass-panel lg:col-span-1 h-[400px] flex flex-col">
                    <CardHeader className="pb-3 border-b border-white/5">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Recent AI Signals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                      {assets?.slice(0, 5).map((asset: Asset, i: number) => (
                        <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`${asset.change24h >= 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} group-hover:bg-opacity-20 transition-colors`}>
                              {asset.change24h >= 0 ? 'BUY' : 'SELL'}
                            </Badge>
                            <span className="font-bold text-sm">{asset.symbol}/USDT</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Confidence</div>
                            <div className="text-sm font-mono text-white">{Math.min(95, Math.max(60, asset.sentimentScore + Math.floor(Math.random() * 10)))}%</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Social Sentiment Widget */}
                  <div className="lg:col-span-1 h-[400px]">
                    <SocialFeed compact />
                  </div>

                  {/* Live Transaction Feed */}
                  <div className="lg:col-span-1 h-[400px] relative">
                    <LiveTransactionFeed />
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components

function NavItem({ icon, label, active, badge, onClick, href }: { icon: any, label: string, active?: boolean, badge?: string, onClick?: () => void, href?: string }) {
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
    return <Link href={href} className="w-full block">{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full">
      {content}
    </button>
  );
}

function StatCard({ label, value, suffix, trend }: { label: string, value: string | number, suffix?: string, trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex flex-col justify-center min-w-[140px]">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-display font-bold text-white">{value}</span>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function MetricBox({ label, value, trend, color }: { label: string, value: string, trend?: string, color?: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <span className={`font-bold ${color || 'text-white'}`}>{value}</span>
        {trend && <span className="text-xs text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">{trend}</span>}
      </div>
    </div>
  );
}

function getSentimentColor(score: number) {
  if (score >= 75) return 'text-green-400 neon-text';
  if (score >= 45) return 'text-yellow-400';
  return 'text-red-400';
}
