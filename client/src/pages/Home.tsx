import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { Asset } from "@shared/marketTypes";
import { SentimentChart } from "@/components/SentimentChart";
import { NewsFeed } from "@/components/NewsFeed";
import { SocialFeed } from "@/components/SocialFeed";
import { LiveTransactionFeed } from "@/components/LiveTransactionFeed";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Cpu, 
  Zap, 
  Loader2,
  Brain,
  TrendingUp,
  BarChart2,
  Globe2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";


export default function Home() {
  const { user, isAuthenticated } = useAuth();
  
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);

  const { data: assets, isLoading: assetsLoading, error: assetsError } = trpc.market.getAssets.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const { data: globalStats } = trpc.market.getGlobalStats.useQuery(undefined, {
    refetchInterval: 60000,
  });

  const { data: userProfile, refetch: refetchProfile } = trpc.user.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateWalletMutation = trpc.user.updateWallet.useMutation({
    onSuccess: () => {
      refetchProfile();
      setShowPointsAnimation(true);
      setTimeout(() => setShowPointsAnimation(false), 3000);
    },
  });

  const selectedAsset = assets?.[selectedAssetIndex] || null;

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
      staleTime: 60000,
    }
  );

  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animated query counter
  const [queryCount, setQueryCount] = useState(2847294);
  useEffect(() => {
    const interval = setInterval(() => {
      setQueryCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppSidebar searchPlaceholder="Search assets..." statusText="Neural Network Active">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section - Enhanced */}
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70">Powered by Vortia Neural Network</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Market Sentiment <span className="gradient-text">Oracle</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              Real-time AI analysis of social signals, on-chain data, and news sentiment across {assets?.length || 31} tracked assets.
            </p>
          </div>
          <div className="flex gap-3">
            <StatCard 
              label="Global Sentiment" 
              value={globalStats?.marketSentiment || 68} 
              suffix="/100" 
              trend="up"
              accent="teal"
            />
            <StatCard 
              label="AI Queries (24h)" 
              value={globalStats?.aiQueries24h || "2.4M"} 
              trend="neutral"
              accent="purple"
            />
          </div>
        </div>

        {/* Main Analysis Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          
          {/* Asset List */}
          <Card className="glass-panel lg:col-span-1 flex flex-col overflow-hidden h-[640px]">
            <CardHeader className="pb-2 border-b border-white/5 flex-shrink-0">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Tracked Assets
                <span className="ml-auto text-[10px] font-mono text-primary/60">{assets?.length || 0} live</span>
                {assetsLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}
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
                    p-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-between group relative
                    ${selectedAssetIndex === index 
                      ? 'bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
                      : 'hover:bg-white/5 border border-transparent hover:border-white/5'}
                  `}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Active indicator */}
                  {selectedAssetIndex === index && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[60%] bg-gradient-to-b from-primary to-purple-500 rounded-r-full" />
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden ring-2 transition-all duration-300 ${selectedAssetIndex === index ? 'ring-primary/40 shadow-[0_0_10px_rgba(20,184,166,0.2)]' : 'ring-transparent'}`}>
                      {asset.image ? (
                        <img src={asset.image} alt={asset.symbol} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${selectedAssetIndex === index ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-muted-foreground'}`}>
                          {asset.symbol[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs group-hover:text-white transition-colors">{asset.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-medium">${(asset.price ?? 0).toLocaleString()}</div>
                    <div className={`text-[10px] flex items-center justify-end font-mono ${(asset.change24h ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(asset.change24h ?? 0) >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                      {Math.abs(asset.change24h ?? 0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Analysis Detail */}
          <Card className="glass-panel lg:col-span-2 flex flex-col relative overflow-hidden scan-effect h-[640px]">
            {/* Background Glow Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none animate-pulse" style={{ animationDuration: '6s' }}></div>
            
            {selectedAsset && (
              <>
                <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between pb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(20,184,166,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                      {selectedAsset.image ? (
                        <img src={selectedAsset.image} alt={selectedAsset.symbol} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display font-bold text-xl">{selectedAsset.symbol}</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-display">{selectedAsset.name} <span className="text-primary">Analysis</span></CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          <span className="text-xs">Live Oracle Feed</span>
                        </span>
                        <span className="text-white/20">|</span>
                        <span className="text-xs font-mono text-primary/60">Updated 2s ago</span>
                      </div>
                    </div>
                  </div>
                  {/* Sentiment Ring */}
                  <div className="text-right flex items-center gap-3">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <circle 
                          cx="32" cy="32" r="28" fill="none" 
                          stroke={selectedAsset.sentimentScore >= 75 ? '#22C55E' : selectedAsset.sentimentScore >= 45 ? '#EAB308' : '#EF4444'}
                          strokeWidth="4" 
                          strokeLinecap="round"
                          strokeDasharray={`${(selectedAsset.sentimentScore / 100) * 175.9} 175.9`}
                          className="transition-all duration-1000 ease-out"
                          style={{ filter: `drop-shadow(0 0 6px ${selectedAsset.sentimentScore >= 75 ? 'rgba(34,197,94,0.4)' : selectedAsset.sentimentScore >= 45 ? 'rgba(234,179,8,0.4)' : 'rgba(239,68,68,0.4)'})` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-lg font-display font-bold ${getSentimentColor(selectedAsset.sentimentScore)}`}>
                          {selectedAsset.sentimentScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 flex flex-col gap-4 relative z-10 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(20, 184, 166, 0.3) transparent' }}>
                  {/* AI Summary Box - Enhanced */}
                  <div className="bg-black/30 rounded-xl p-5 border border-primary/10 relative group hover:border-primary/20 transition-all duration-300">
                    <div className="absolute -left-[1px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-primary via-purple-500 to-transparent rounded-r-full shadow-[0_0_8px_rgba(20,184,166,0.3)]"></div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Vortia AI Insight</h4>
                          <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                        </div>
                        {aiLoading ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="animate-pulse">Analyzing market data...</span>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed text-gray-300">
                            {aiAnalysis?.analysis || "Powered by Vortia Neural Network \u2014 Initializing..."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid - Enhanced with accent borders */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <MetricBox 
                      label="Social Volume" 
                      value={selectedAsset.volume24h ? `$${(selectedAsset.volume24h / 1e9).toFixed(2)}B` : "N/A"} 
                      trend="+12%" 
                      icon={<TrendingUp className="w-3.5 h-3.5 text-teal-400" />}
                      accent="teal"
                    />
                    <MetricBox 
                      label="News Sentiment" 
                      value={selectedAsset.sentimentTrend === 'bullish' ? 'Positive' : selectedAsset.sentimentTrend === 'bearish' ? 'Negative' : 'Neutral'} 
                      color={selectedAsset.sentimentTrend === 'bullish' ? 'text-green-400' : selectedAsset.sentimentTrend === 'bearish' ? 'text-red-400' : 'text-yellow-400'}
                      icon={<BarChart2 className="w-3.5 h-3.5 text-purple-400" />}
                      accent="purple"
                    />
                    <MetricBox 
                      label="Market Cap" 
                      value={selectedAsset.marketCap ? `$${(selectedAsset.marketCap / 1e9).toFixed(1)}B` : "N/A"} 
                      color="text-cyan-400"
                      icon={<Globe2 className="w-3.5 h-3.5 text-cyan-400" />}
                      accent="cyan"
                    />
                  </div>

                  {/* Sentiment Chart */}
                  <div className="bg-white/5 rounded-xl border border-white/5 p-4 relative hover:border-white/10 transition-all duration-300">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price & Sentiment Correlation</h3>
                      <span className="text-[10px] font-mono text-primary/50">7D</span>
                    </div>
                    <div className="h-[200px] w-full">
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
          <div className="lg:col-span-1 h-[400px]">
            <NewsFeed />
          </div>

          <Card className="glass-panel lg:col-span-1 h-[400px] flex flex-col">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]" />
                Recent AI Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 stagger-children">
              {assets?.slice(0, 5).map((asset: Asset, i: number) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/8 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${asset.change24h >= 0 ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.15)]' : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]'} group-hover:bg-opacity-20 transition-all font-bold text-[10px]`}>
                      {asset.change24h >= 0 ? 'BUY' : 'SELL'}
                    </Badge>
                    <span className="font-bold text-sm">{asset.symbol}/USDT</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">Confidence</div>
                    <div className="text-sm font-mono text-white font-bold">{Math.min(95, Math.max(60, asset.sentimentScore + Math.floor(Math.random() * 10)))}%</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="lg:col-span-1 h-[400px]">
            <SocialFeed compact />
          </div>

          <div className="lg:col-span-1 h-[400px] relative">
            <LiveTransactionFeed />
          </div>
        </div>

      </div>
    </AppSidebar>
  );
}

// Enhanced Helper Components

function StatCard({ label, value, suffix, trend, accent = "teal" }: { label: string, value: string | number, suffix?: string, trend: 'up' | 'down' | 'neutral', accent?: string }) {
  const accentClass = accent === "purple" ? "stat-accent-purple" : "stat-accent-teal";
  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex flex-col justify-center min-w-[140px] ${accentClass} hover:bg-white/8 transition-all duration-300`}>
      <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-display font-bold text-white">{value}</span>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function MetricBox({ label, value, trend, color, icon, accent = "teal" }: { label: string, value: string, trend?: string, color?: string, icon?: React.ReactNode, accent?: string }) {
  const borderColor = accent === "purple" ? "border-l-purple-500" : accent === "cyan" ? "border-l-cyan-500" : "border-l-teal-500";
  return (
    <div className={`bg-white/5 rounded-lg p-3 border border-white/5 border-l-[3px] ${borderColor} hover:bg-white/8 transition-all duration-300`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`font-bold ${color || 'text-white'}`}>{value}</span>
        {trend && <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded font-mono">{trend}</span>}
      </div>
    </div>
  );
}

function getSentimentColor(score: number) {
  if (score >= 75) return 'text-green-400 neon-text';
  if (score >= 45) return 'text-yellow-400';
  return 'text-red-400';
}
