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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/components/AppSidebar";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredModels = mockModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppSidebar searchPlaceholder="Search models..." statusText="Neural Network Active">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Beta Access</Badge>
              <span className="text-sm text-muted-foreground">Vortia Ecosystem</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              AI Model <span className="gradient-text">Marketplace</span>
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
    </AppSidebar>
  );
}
