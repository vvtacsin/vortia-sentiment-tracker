import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Server,
  Database,
  Wifi,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Network,
  HardDrive,
  Radio,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { AppSidebar } from "@/components/AppSidebar";

// Generate mock throughput data
const generateThroughputData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      throughput: Math.floor(Math.random() * 2000) + 3000,
      requests: Math.floor(Math.random() * 50000) + 100000,
    });
  }
  return data;
};

// Oracle node data
const oracleNodes = [
  { id: 1, name: "Oracle Node Alpha", region: "US-East", status: "active", latency: 12, uptime: 99.99 },
  { id: 2, name: "Oracle Node Beta", region: "EU-West", status: "active", latency: 18, uptime: 99.97 },
  { id: 3, name: "Oracle Node Gamma", region: "Asia-Pacific", status: "active", latency: 25, uptime: 99.95 },
  { id: 4, name: "Oracle Node Delta", region: "US-West", status: "active", latency: 15, uptime: 99.98 },
  { id: 5, name: "Oracle Node Epsilon", region: "EU-Central", status: "maintenance", latency: 0, uptime: 99.92 },
];

// Data source integrations
const dataSources = [
  { name: "CoinGecko", type: "Price Feed", status: "connected", requests: "2.4M/day" },
  { name: "Twitter/X API", type: "Social Data", status: "connected", requests: "1.8M/day" },
  { name: "Reddit API", type: "Social Data", status: "connected", requests: "890K/day" },
  { name: "Chainlink", type: "Oracle", status: "connected", requests: "450K/day" },
  { name: "The Graph", type: "Blockchain Data", status: "connected", requests: "1.2M/day" },
  { name: "Etherscan", type: "Blockchain Data", status: "connected", requests: "780K/day" },
];

export default function DataGateway() {
  const [throughputData, setThroughputData] = useState(generateThroughputData());
  const [liveStats, setLiveStats] = useState({
    activeValidators: 1420,
    totalRequests: 847293847,
    avgLatency: 14,
    uptime: 99.97,
    throughput: 4.2,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeValidators: prev.activeValidators + Math.floor(Math.random() * 5) - 2,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 1000),
        avgLatency: Math.max(10, Math.min(25, prev.avgLatency + (Math.random() - 0.5) * 2)),
        throughput: Math.max(3, Math.min(6, prev.throughput + (Math.random() - 0.5) * 0.3)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update throughput chart periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setThroughputData(generateThroughputData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppSidebar searchPlaceholder="Search data sources..." statusText="All Systems Operational">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Data <span className="text-primary">Gateway</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Real-time monitoring of the Vortia Oracle Network. Track validator performance, data throughput, and network health.
            </p>
          </div>
        </div>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-panel">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">Active Validators</div>
              </div>
              <div className="text-2xl font-display font-bold text-white">
                {liveStats.activeValidators.toLocaleString()}
              </div>
              <div className="text-xs text-green-400 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +24 this hour
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-xs text-muted-foreground">Total Requests</div>
              </div>
              <div className="text-2xl font-display font-bold text-white">
                {(liveStats.totalRequests / 1e6).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">All time</div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-xs text-muted-foreground">Avg Latency</div>
              </div>
              <div className="text-2xl font-display font-bold text-white">
                {liveStats.avgLatency.toFixed(0)}ms
              </div>
              <div className="text-xs text-green-400 mt-1">Excellent</div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-xs text-muted-foreground">Network Uptime</div>
              </div>
              <div className="text-2xl font-display font-bold text-white">
                {liveStats.uptime}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
            </CardContent>
          </Card>
        </div>

        {/* Throughput Chart & Oracle Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Throughput Chart */}
          <Card className="glass-panel lg:col-span-2">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Data Throughput (24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughputData}>
                    <defs>
                      <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()} MB/s`, 'Throughput']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="throughput" 
                      stroke="#14B8A6" 
                      fill="url(#throughputGradient)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-8 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Current: {liveStats.throughput.toFixed(1)} GB/s</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <span className="text-muted-foreground">Peak: 6.8 GB/s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Oracle Nodes Status */}
          <Card className="glass-panel">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-primary" />
                Oracle Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {oracleNodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                    <div>
                      <div className="text-sm font-medium">{node.name}</div>
                      <div className="text-xs text-muted-foreground">{node.region}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {node.status === 'active' ? (
                      <>
                        <div className="text-xs text-green-400">{node.latency}ms</div>
                        <div className="text-xs text-muted-foreground">{node.uptime}%</div>
                      </>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px]">
                        Maintenance
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Data Sources */}
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-primary" />
              Connected Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map((source) => (
                <div key={source.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{source.name}</div>
                      <div className="text-xs text-muted-foreground">{source.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{source.requests}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">CPU Utilization</span>
                <span className="text-sm font-bold text-white">42%</span>
              </div>
              <Progress value={42} className="h-2 bg-white/10" />
              <div className="text-xs text-green-400 mt-2">Healthy</div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Memory Usage</span>
                <span className="text-sm font-bold text-white">68%</span>
              </div>
              <Progress value={68} className="h-2 bg-white/10" />
              <div className="text-xs text-yellow-400 mt-2">Moderate</div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Storage Capacity</span>
                <span className="text-sm font-bold text-white">31%</span>
              </div>
              <Progress value={31} className="h-2 bg-white/10" />
              <div className="text-xs text-green-400 mt-2">Plenty Available</div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppSidebar>
  );
}
