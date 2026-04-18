import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  BarChart3,
  Layers,
  Globe,
  ShieldCheck,
  Settings,
  Search,
  Menu,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Shared NavItem component with glow effect
function NavItem({ icon, label, active, badge, href }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string; href?: string }) {
  const content = (
    <div className={`
      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative group
      ${active 
        ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
        : 'text-muted-foreground hover:text-white hover:bg-white/5'}
    `}>
      {/* Active indicator bar */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full bg-gradient-to-b from-primary to-purple-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
      )}
      <div className="flex items-center gap-3">
        <span className={`transition-all duration-300 ${active ? 'drop-shadow-[0_0_6px_rgba(20,184,166,0.5)]' : 'group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge && (
        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse">
          {badge}
        </Badge>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="w-full block">{content}</Link>;
  }
  return <button className="w-full">{content}</button>;
}

// Animated counter component
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <>{count.toLocaleString()}</>;
}

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: i % 2 === 0 ? '#14B8A6' : '#8B5CF6',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-orb ${Math.random() * 4 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

// Live "last sync" counter
function NetworkLastSync() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => (s >= 30 ? 0 : s + 1)), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>Last sync: {secs}s ago</span>;
}

interface AppSidebarProps {
  searchPlaceholder?: string;
  statusText?: string;
  children: React.ReactNode;
}

export function AppSidebar({ searchPlaceholder = "Search...", statusText = "System Operational", children }: AppSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useLocation();

  // Determine active page from current route
  const activePage = (() => {
    if (location === "/") return "sentiment";
    if (location === "/market") return "market";
    if (location.startsWith("/marketplace")) return "marketplace";
    if (location === "/data-gateway") return "data-gateway";
    if (location === "/portfolio") return "portfolio";
    if (location === "/settings") return "settings";
    return "sentiment";
  })();

  return (
    <div className="min-h-screen text-foreground flex overflow-hidden selection:bg-primary/30">
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block
      `}>
        <div className="h-full flex flex-col relative">
          <FloatingParticles />
          
          {/* Logo with glow */}
          <div className="p-6 flex items-center gap-3 relative">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/vortia-logo.png" alt="Vortia AI" className="h-8 w-auto relative z-10 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]" />
            </div>
          </div>

          <div className="px-4 py-2">
            <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-4 px-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              Platform
              <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
            </div>
            <nav className="space-y-1 stagger-children">
              <NavItem icon={<Activity className="w-4 h-4" />} label="Sentiment Tracker" active={activePage === "sentiment"} href="/" />
              <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Market Overview" active={activePage === "market"} href="/market" />
              <NavItem icon={<Layers className="w-4 h-4" />} label="AI Models" badge="Beta" active={activePage === "marketplace"} href="/marketplace" />
              <NavItem icon={<Globe className="w-4 h-4" />} label="Data Gateway" active={activePage === "data-gateway"} href="/data-gateway" />
            </nav>
          </div>

          <div className="px-4 py-2 mt-6">
            <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-4 px-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              Account
              <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
            </div>
            <nav className="space-y-1">
              <NavItem icon={<ShieldCheck className="w-4 h-4" />} label="Portfolio Risk" active={activePage === "portfolio"} href="/portfolio" />
              <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" active={activePage === "settings"} href="/settings" />
            </nav>
          </div>

          {/* VAI Token Card - Enhanced */}
          <div className="mt-auto p-6 relative z-10">
            <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-cyan-500/5 border-primary/20 glow-card shimmer-overlay overflow-hidden">
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    VAI Token
                  </span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    +12.4%
                  </Badge>
                </div>
                <div className="text-2xl font-display font-bold neon-text">$0.85</div>
                <a href="https://crowdsale.vortia.ai/tokenlite/public/register" target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="sm" className="w-full mt-3 bg-gradient-to-r from-primary to-teal-400 hover:from-primary/90 hover:to-teal-400/90 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all duration-300">
                    Buy VAI
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header - Enhanced */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-background/50 backdrop-blur-md sticky top-0 z-40 relative">
          {/* Subtle bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative group lg:hidden">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src="/vortia-logo.png" alt="Vortia AI" className="h-8 w-auto relative z-10" />
              </div>
              <div className="hidden md:flex items-center text-sm text-muted-foreground gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-xs tracking-wide">{statusText}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={searchPlaceholder}
                className="pl-9 w-64 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/8 focus:shadow-[0_0_15px_rgba(20,184,166,0.1)] transition-all duration-300 rounded-full h-9 text-sm" 
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col">
          <div className="flex-1 p-4 lg:p-8">
            <div key={location} className="page-transition-enter">
              {children}
            </div>
          </div>

          {/* Network Status Footer */}
          <footer className="network-footer">
            <div className="flex items-center gap-3 flex-wrap">
              <span>
                <span className="node-dot" />
                Connected to 4 oracle nodes
              </span>
              <span className="separator">·</span>
              <span>Latency: {Math.floor(Math.random() * 8) + 8}ms</span>
              <span className="separator">·</span>
              <NetworkLastSync />
              <span className="separator">·</span>
              <span className="text-primary/40">v1.0.0-beta</span>
            </div>
            <div className="powered-by-row border-0 p-0 bg-transparent">
              <span className="powered-label">Data from</span>
              <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" className="data-source">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                CoinGecko
              </a>
              <span className="separator">·</span>
              <a href="https://chain.link" target="_blank" rel="noopener noreferrer" className="data-source">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Chainlink
              </a>
              <span className="separator">·</span>
              <a href="https://thegraph.com" target="_blank" rel="noopener noreferrer" className="data-source">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,8 22,16 12,22 2,16 2,8"/></svg>
                The Graph
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export { AnimatedCounter, FloatingParticles };
