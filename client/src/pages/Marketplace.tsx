import { useState } from "react";
import { Link } from "wouter";
import { mockModels } from "@/lib/mockModels";
import { 
  Search, 
  Star, 
  Users, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  Image as ImageIcon,
  Activity,
  Layers,
  Globe,
  Zap,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredModels = mockModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Beta Access</Badge>
                  <span className="text-sm text-muted-foreground">Vortia Ecosystem</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                  AI Model <span className="text-primary">Marketplace</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Discover, integrate, and monetize decentralized AI models using VAI tokens. 
                  The world's first blockchain-verified AI algorithm store.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  Become a Creator
                </Button>
                <Button className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30">
                  API Key Active
                </Button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search for models, algorithms..." 
                  className="pl-9 bg-black/20 border-white/10 focus:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={setSelectedCategory}>
                <TabsList className="bg-black/20 border border-white/5">
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Trading">Trading</TabsTrigger>
                  <TabsTrigger value="DeFi">DeFi</TabsTrigger>
                  <TabsTrigger value="Security">Security</TabsTrigger>
                  <TabsTrigger value="NFT">NFT</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <Card key={model.id} className="glass-panel group hover:border-primary/30 transition-all duration-300 flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${model.category === 'Trading' ? 'bg-blue-500/10 text-blue-400' : 
                          model.category === 'DeFi' ? 'bg-green-500/10 text-green-400' : 
                          model.category === 'Security' ? 'bg-red-500/10 text-red-400' : 
                          'bg-purple-500/10 text-purple-400'}
                      `}>
                        {model.category === 'Trading' && <BarChart3 className="w-5 h-5" />}
                        {model.category === 'DeFi' && <Cpu className="w-5 h-5" />}
                        {model.category === 'Security' && <ShieldCheck className="w-5 h-5" />}
                        {model.category === 'NFT' && <ImageIcon className="w-5 h-5" />}
                      </div>
                      <Badge variant="secondary" className="bg-white/5 hover:bg-white/10">
                        {model.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">
                      {model.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      by <span className="text-white font-medium">{model.provider}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {model.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {model.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-medium">{model.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{model.users.toLocaleString()} users</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <div className="font-mono font-bold text-primary">
                      {model.price}
                    </div>
                    <Link href={`/marketplace/${model.id}`}>
                      <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary group/btn">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
