import { useState } from "react";
import { trpc } from "@/lib/trpc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Plus,
  Trash2,
  Loader2,
  Cpu,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { AppSidebar } from "@/components/AppSidebar";

interface Holding {
  id: string;
  symbol: string;
  amount: number;
  value?: number;
}

const COLORS = ['#14B8A6', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#10B981', '#6366F1'];

const SUPPORTED_COINS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'UNI', name: 'Uniswap' },
  { symbol: 'ATOM', name: 'Cosmos' },
  { symbol: 'VAI', name: 'Vortia AI' },
];

export default function PortfolioRisk() {
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: '1', symbol: 'BTC', amount: 0.5 },
    { id: '2', symbol: 'ETH', amount: 5 },
    { id: '3', symbol: 'SOL', amount: 20 },
  ]);
  const [newSymbol, setNewSymbol] = useState('');
  const [newAmount, setNewAmount] = useState('');

  // Fetch market data for price calculations
  const { data: assets } = trpc.market.getAssets.useQuery();

  // Fetch AI risk analysis
  const { data: riskAnalysis, isLoading: analysisLoading, refetch: refetchAnalysis } = trpc.portfolio.analyzeRisk.useQuery(
    { holdings: holdings.map(h => ({ symbol: h.symbol, amount: h.amount })) },
    { enabled: holdings.length > 0 }
  );

  // Calculate portfolio values
  const portfolioData = holdings.map(holding => {
    const asset = assets?.find((a: any) => a.symbol === holding.symbol);
    const price = asset?.price || (holding.symbol === 'VAI' ? 0.85 : 0);
    const value = holding.amount * price;
    return { ...holding, value, price };
  });

  const totalValue = portfolioData.reduce((sum, h) => sum + (h.value || 0), 0);

  // Pie chart data
  const pieData = portfolioData.map(h => ({
    name: h.symbol,
    value: h.value || 0,
    percentage: totalValue > 0 ? ((h.value || 0) / totalValue * 100).toFixed(1) : 0,
  }));

  // Risk metrics for radar chart
  const riskMetrics = [
    { metric: 'Diversification', value: riskAnalysis?.diversificationScore || 50, fullMark: 100 },
    { metric: 'Volatility', value: riskAnalysis?.volatilityScore || 60, fullMark: 100 },
    { metric: 'Correlation', value: riskAnalysis?.correlationScore || 70, fullMark: 100 },
    { metric: 'Liquidity', value: riskAnalysis?.liquidityScore || 80, fullMark: 100 },
    { metric: 'Concentration', value: riskAnalysis?.concentrationScore || 55, fullMark: 100 },
  ];

  const addHolding = () => {
    if (newSymbol && newAmount) {
      const coin = SUPPORTED_COINS.find(c => c.symbol.toUpperCase() === newSymbol.toUpperCase());
      if (coin) {
        setHoldings([...holdings, {
          id: Date.now().toString(),
          symbol: coin.symbol,
          amount: parseFloat(newAmount),
        }]);
        setNewSymbol('');
        setNewAmount('');
      }
    }
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'Low Risk', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (score >= 40) return { label: 'Medium Risk', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { label: 'High Risk', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  const overallRisk = getRiskLevel(riskAnalysis?.overallScore || 50);

  return (
    <AppSidebar searchPlaceholder="Search portfolio..." statusText="Neural Network Active">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Portfolio <span className="gradient-text">Risk Analyzer</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              AI-powered analysis of your crypto portfolio's risk profile, diversification, and optimization recommendations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`${overallRisk.bg} ${overallRisk.color} border-current h-9 px-4`}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              {overallRisk.label}
            </Badge>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings Input */}
          <Card className="glass-panel lg:col-span-1">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Your Holdings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Add Holding Form */}
              <div className="flex gap-2">
                <select
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-none"
                >
                  <option value="">Select coin...</option>
                  {SUPPORTED_COINS.filter(c => !holdings.find(h => h.symbol === c.symbol)).map(coin => (
                    <option key={coin.symbol} value={coin.symbol}>{coin.symbol} - {coin.name}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-24 bg-white/5 border-white/10"
                />
                <Button size="icon" onClick={addHolding} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Holdings List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {portfolioData.map((holding, index) => (
                  <div key={holding.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 group">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: COLORS[index % COLORS.length] + '20', color: COLORS[index % COLORS.length] }}
                      >
                        {holding.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{holding.symbol}</div>
                        <div className="text-xs text-muted-foreground">{holding.amount} units</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono text-sm">${(holding.value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        <div className="text-xs text-muted-foreground">
                          {totalValue > 0 ? ((holding.value || 0) / totalValue * 100).toFixed(1) : 0}%
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={() => removeHolding(holding.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Value */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Portfolio Value</span>
                  <span className="text-2xl font-display font-bold text-white">
                    ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => refetchAnalysis()}
                disabled={analysisLoading}
              >
                {analysisLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 mr-2" />
                    Analyze Portfolio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Charts and Analysis */}
          <Card className="glass-panel lg:col-span-2">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Risk Analysis Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="h-[250px]">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Portfolio Allocation</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                      />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                {/* Radar Chart */}
                <div className="h-[250px]">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Risk Metrics</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riskMetrics}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="#14B8A6"
                        fill="#14B8A6"
                        fillOpacity={0.3}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                {riskMetrics.map((metric, index) => (
                  <div key={metric.metric} className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">{metric.metric}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                        {metric.value}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                    <Progress value={metric.value} className="h-1 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Vortia AI Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {analysisLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Analyzing your portfolio...</span>
              </div>
            ) : riskAnalysis?.aiInsight ? (
              <div className="space-y-6">
                <div className="bg-black/20 rounded-xl p-5 border border-white/5 relative">
                  <div className="absolute -left-[1px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-primary to-transparent rounded-r-full"></div>
                  <p className="text-gray-300 leading-relaxed">{riskAnalysis.aiInsight}</p>
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-green-400">Strengths</span>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {riskAnalysis.strengths?.map((s: string, i: number) => (
                        <li key={i}>• {s}</li>
                      )) || <li>• Good diversification across major assets</li>}
                    </ul>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium text-yellow-400">Recommendations</span>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {riskAnalysis.recommendations?.map((r: string, i: number) => (
                        <li key={i}>• {r}</li>
                      )) || <li>• Consider adding stablecoins for reduced volatility</li>}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Add your holdings and click "Analyze Portfolio" to get AI-powered risk insights</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppSidebar>
  );
}
