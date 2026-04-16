import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { mockModels } from "@/lib/mockModels";
import { 
  ArrowLeft,
  Star, 
  Users, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  Image as ImageIcon,
  Activity,
  Layers,
  Globe,
  Zap,
  Menu,
  Search,
  Copy,
  Check,
  Clock,
  Code,
  FileText,
  TrendingUp,
  Shield,
  Sparkles,
  Terminal,
  BookOpen,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";



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

// API code examples for different languages
const getCodeExamples = (modelId: string, modelName: string) => ({
  javascript: `// Install: npm install @vortia/sdk

import { VortiaClient } from '@vortia/sdk';

const client = new VortiaClient({
  apiKey: 'your_api_key',
  walletAddress: '0x...'
});

// Call the ${modelName} model
const result = await client.models.invoke({
  modelId: '${modelId}',
  input: {
    asset: 'BTC',
    timeframe: '24h'
  }
});

console.log(result.prediction);
console.log(result.confidence);`,

  python: `# Install: pip install vortia-sdk

from vortia import VortiaClient

client = VortiaClient(
    api_key="your_api_key",
    wallet_address="0x..."
)

# Call the ${modelName} model
result = client.models.invoke(
    model_id="${modelId}",
    input={
        "asset": "BTC",
        "timeframe": "24h"
    }
)

print(result.prediction)
print(result.confidence)`,

  curl: `curl -X POST https://api.vortia.ai/v1/models/${modelId}/invoke \\
  -H "Authorization: Bearer your_api_key" \\
  -H "X-Wallet-Address: 0x..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": {
      "asset": "BTC",
      "timeframe": "24h"
    }
  }'`
});

// Generate mock stats for each model
const getModelStats = (modelId: string) => {
  const seed = parseInt(modelId) || 1;
  return {
    totalCalls: Math.floor(seed * 127453 + 50000),
    avgResponseTime: (seed * 0.3 + 0.5).toFixed(2),
    uptime: (99.9 - seed * 0.02).toFixed(2),
    lastUpdated: "2 days ago"
  };
};

// Generate mock reviews
const getModelReviews = (modelId: string) => [
  {
    id: 1,
    user: "0x7a3d...8f2c",
    rating: 5,
    comment: "Incredibly accurate predictions. Saved me from a major dump last week.",
    date: "3 days ago"
  },
  {
    id: 2,
    user: "0x9e1b...4a7d",
    rating: 4,
    comment: "Great model, fast response times. Would love to see more timeframe options.",
    date: "1 week ago"
  },
  {
    id: 3,
    user: "0x2c8f...6b1e",
    rating: 5,
    comment: "Essential tool for my trading strategy. The API is well documented.",
    date: "2 weeks ago"
  }
];

export default function ModelDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");


  // Find the model by ID
  const model = mockModels.find(m => m.id === params.id);

  if (!model) {
    return (
      <div className="min-h-screen text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Model Not Found</h1>
          <Button onClick={() => setLocation("/marketplace")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const codeExamples = getCodeExamples(model.id, model.name);
  const stats = getModelStats(model.id);
  const reviews = getModelReviews(model.id);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[selectedLanguage as keyof typeof codeExamples]);
    setCopiedCode(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Trading': return <BarChart3 className="w-6 h-6" />;
      case 'DeFi': return <Cpu className="w-6 h-6" />;
      case 'Security': return <ShieldCheck className="w-6 h-6" />;
      case 'NFT': return <ImageIcon className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Trading': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'DeFi': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Security': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'NFT': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
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
              <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Market Overview" href="/market" />
              <NavItem icon={<Layers className="w-4 h-4" />} label="AI Models" badge="Beta" active href="/marketplace" />
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
                placeholder="Search models..." 
                className="pl-9 w-64 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-full h-9 text-sm" 
              />
            </div>
            

          </div>
        </header>

        {/* Model Detail Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Back Button */}
            <Link href="/marketplace">
              <Button variant="ghost" className="text-muted-foreground hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>

            {/* Model Header */}
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getCategoryColor(model.category)}`}>
                  {getCategoryIcon(model.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-white/5">
                      {model.category}
                    </Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      Verified
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                    {model.name}
                  </h1>
                  <p className="text-muted-foreground">
                    by <span className="text-white font-medium">{model.provider}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Price</div>
                  <div className="text-2xl font-mono font-bold text-primary">{model.price}</div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Subscribe & Get API Key
                  </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-panel">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{model.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{model.users.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total API Calls</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.avgResponseTime}s</div>
                    <div className="text-xs text-muted-foreground">Avg Response</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <FileText className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="api" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Code className="w-4 h-4 mr-2" />
                  API Docs
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {model.description}
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      This model leverages advanced machine learning algorithms trained on extensive datasets to provide 
                      highly accurate predictions. It's designed for both retail and institutional traders who need 
                      reliable, real-time insights to make informed decisions.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {model.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-white/5 text-gray-300">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-panel">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="w-4 h-4 text-green-400" />
                          Real-time data processing
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="w-4 h-4 text-green-400" />
                          Multi-chain support
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="w-4 h-4 text-green-400" />
                          Historical backtesting
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="w-4 h-4 text-green-400" />
                          Webhook notifications
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <Check className="w-4 h-4 text-green-400" />
                          Custom alert thresholds
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="glass-panel">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-blue-400" />
                        Technical Specs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Uptime</span>
                          <span className="text-green-400 font-mono">{stats.uptime}%</span>
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg Response Time</span>
                          <span className="text-white font-mono">{stats.avgResponseTime}s</span>
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rate Limit</span>
                          <span className="text-white font-mono">100 req/min</span>
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Updated</span>
                          <span className="text-white">{stats.lastUpdated}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* API Docs Tab */}
              <TabsContent value="api" className="mt-6 space-y-6">
                <Card className="glass-panel">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        Quick Start
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant={selectedLanguage === "javascript" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedLanguage("javascript")}
                          className={selectedLanguage === "javascript" ? "bg-primary" : "border-white/10"}
                        >
                          JavaScript
                        </Button>
                        <Button 
                          variant={selectedLanguage === "python" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedLanguage("python")}
                          className={selectedLanguage === "python" ? "bg-primary" : "border-white/10"}
                        >
                          Python
                        </Button>
                        <Button 
                          variant={selectedLanguage === "curl" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedLanguage("curl")}
                          className={selectedLanguage === "curl" ? "bg-primary" : "border-white/10"}
                        >
                          cURL
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 border border-white/5">
                        <code>{codeExamples[selectedLanguage as keyof typeof codeExamples]}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-white"
                        onClick={copyCode}
                      >
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Response Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 border border-white/5">
                      <code>{`{
  "success": true,
  "data": {
    "prediction": "bullish",
    "confidence": 0.87,
    "signals": [
      { "type": "social_volume", "value": 1.5, "weight": 0.3 },
      { "type": "whale_activity", "value": 0.8, "weight": 0.25 },
      { "type": "news_sentiment", "value": 0.72, "weight": 0.25 },
      { "type": "technical", "value": 0.65, "weight": 0.2 }
    ],
    "timestamp": "2024-01-15T12:00:00Z"
  },
  "cost": {
    "vai_charged": 0.5,
    "balance_remaining": 99.5
  }
}`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">User Reviews</h3>
                  <Button variant="outline" className="border-white/10">
                    Write a Review
                  </Button>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="glass-panel">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-mono text-primary">{review.user.slice(0, 4)}</span>
                            </div>
                            <div>
                              <div className="font-mono text-sm">{review.user}</div>
                              <div className="text-xs text-muted-foreground">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </main>
    </div>
  );
}
