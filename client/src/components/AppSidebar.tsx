import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  BarChart3,
  Layers,
  Globe,
  ShieldCheck,
  Zap,
  Search,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Shared NavItem component
function NavItem({ icon, label, active, badge, href }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string; href?: string }) {
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
  return <button className="w-full">{content}</button>;
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

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
              <NavItem icon={<Activity className="w-4 h-4" />} label="Sentiment Tracker" active={activePage === "sentiment"} href="/" />
              <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Market Overview" active={activePage === "market"} href="/market" />
              <NavItem icon={<Layers className="w-4 h-4" />} label="AI Models" badge="Beta" active={activePage === "marketplace"} href="/marketplace" />
              <NavItem icon={<Globe className="w-4 h-4" />} label="Data Gateway" active={activePage === "data-gateway"} href="/data-gateway" />
            </nav>
          </div>

          <div className="px-4 py-2 mt-6">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Account</div>
            <nav className="space-y-1">
              <NavItem icon={<ShieldCheck className="w-4 h-4" />} label="Portfolio Risk" active={activePage === "portfolio"} href="/portfolio" />
              <NavItem icon={<Zap className="w-4 h-4" />} label="Settings" active={activePage === "settings"} href="/settings" />
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
                {statusText}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={searchPlaceholder}
                className="pl-9 w-64 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-full h-9 text-sm" 
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
