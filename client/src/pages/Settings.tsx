import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Cpu,
  Wallet,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Crown,
  Clock,
  BarChart3,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";

// Toggle switch component
function Toggle({ enabled, onChange, label, description }: { enabled: boolean; onChange: () => void; label: string; description?: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-primary' : 'bg-white/10'
        }`}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    aiSignals: true,
    portfolioUpdates: true,
    newsDigest: false,
    weeklyReport: true,
    soundEnabled: false,
  });
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    theme: 'dark',
    language: 'en',
    autoRefresh: true,
    compactMode: false,
    animationsEnabled: true,
  });

  const mockApiKey = "vai_sk_7x9Kp2mN4rT8vW1qY6bJ3cF5gH0dL";

  const copyApiKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedKey(true);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <AppSidebar searchPlaceholder="Search settings..." statusText="Neural Network Active">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Manage your account, API access, notification preferences, and platform configuration.
          </p>
        </div>

        {/* Subscription Plan */}
        <Card className="glass-panel overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-display font-bold text-white">Pro Plan</h2>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">Unlimited AI signals, priority data access, and advanced analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-white">49 VAI</div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  Manage Plan
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-muted-foreground mb-1">API Calls Used</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white">8,432</span>
                  <span className="text-xs text-muted-foreground">/ 50,000</span>
                </div>
                <Progress value={16.8} className="h-1.5" />
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-muted-foreground mb-1">AI Queries</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white">342</span>
                  <span className="text-xs text-muted-foreground">/ 5,000</span>
                </div>
                <Progress value={6.8} className="h-1.5" />
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-muted-foreground mb-1">Next Billing</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg font-bold text-white">May 16</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* API Access */}
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Access
            </CardTitle>
            <CardDescription>Manage your API keys for programmatic access to Vortia AI models and data.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  readOnly
                  value={apiKeyVisible ? mockApiKey : "vai_sk_••••••••••••••••••••••••••••"}
                  className="bg-black/30 border-white/10 font-mono text-sm pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-white"
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  >
                    {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-white"
                    onClick={copyApiKey}
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Key Active</span>
              </div>
              <div>Created: Mar 15, 2026</div>
              <div>Last used: 2 hours ago</div>
            </div>

            <Separator className="bg-white/5" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Webhook Endpoint</div>
                <div className="text-xs text-muted-foreground mt-0.5">Receive real-time notifications via webhook</div>
              </div>
              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                Configure
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure which alerts and updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-1">
              <Toggle
                enabled={notifications.priceAlerts}
                onChange={() => setNotifications(prev => ({ ...prev, priceAlerts: !prev.priceAlerts }))}
                label="Price Alerts"
                description="Get notified when tracked assets hit your price targets"
              />
              <Separator className="bg-white/5" />
              <Toggle
                enabled={notifications.aiSignals}
                onChange={() => setNotifications(prev => ({ ...prev, aiSignals: !prev.aiSignals }))}
                label="AI Trading Signals"
                description="Receive buy/sell signals from Vortia Neural Network"
              />
              <Separator className="bg-white/5" />
              <Toggle
                enabled={notifications.portfolioUpdates}
                onChange={() => setNotifications(prev => ({ ...prev, portfolioUpdates: !prev.portfolioUpdates }))}
                label="Portfolio Risk Updates"
                description="Alerts when your portfolio risk profile changes significantly"
              />
              <Separator className="bg-white/5" />
              <Toggle
                enabled={notifications.newsDigest}
                onChange={() => setNotifications(prev => ({ ...prev, newsDigest: !prev.newsDigest }))}
                label="Daily News Digest"
                description="Curated crypto news summary delivered daily"
              />
              <Separator className="bg-white/5" />
              <Toggle
                enabled={notifications.weeklyReport}
                onChange={() => setNotifications(prev => ({ ...prev, weeklyReport: !prev.weeklyReport }))}
                label="Weekly Performance Report"
                description="Weekly summary of your portfolio performance and market insights"
              />
              <Separator className="bg-white/5" />
              <Toggle
                enabled={notifications.soundEnabled}
                onChange={() => setNotifications(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                label="Sound Notifications"
                description="Play a sound when new alerts arrive"
              />
            </div>
          </CardContent>
        </Card>

        {/* Display & Preferences */}
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Display & Preferences
            </CardTitle>
            <CardDescription>Customize the look and feel of the platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Theme Selection */}
            <div>
              <div className="text-sm font-medium text-white mb-3">Theme</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setPreferences(prev => ({ ...prev, theme: value }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                      preferences.theme === value
                        ? 'bg-primary/10 border-primary/50 text-primary'
                        : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-white/5" />

            {/* Currency Selection */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Display Currency</div>
                <div className="text-xs text-muted-foreground mt-0.5">Choose your preferred fiat currency for price display</div>
              </div>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (&euro;)</option>
                <option value="GBP">GBP (&pound;)</option>
                <option value="JPY">JPY (&yen;)</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>

            <Separator className="bg-white/5" />

            {/* Language */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Language</div>
                <div className="text-xs text-muted-foreground mt-0.5">Interface language</div>
              </div>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-none"
              >
                <option value="en">English</option>
                <option value="es">Espa&ntilde;ol</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>

            <Separator className="bg-white/5" />

            <Toggle
              enabled={preferences.autoRefresh}
              onChange={() => setPreferences(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
              label="Auto-Refresh Data"
              description="Automatically refresh market data and AI signals"
            />
            <Separator className="bg-white/5" />
            <Toggle
              enabled={preferences.compactMode}
              onChange={() => setPreferences(prev => ({ ...prev, compactMode: !prev.compactMode }))}
              label="Compact Mode"
              description="Show more data with reduced spacing"
            />
            <Separator className="bg-white/5" />
            <Toggle
              enabled={preferences.animationsEnabled}
              onChange={() => setPreferences(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }))}
              label="Animations"
              description="Enable smooth transitions and visual effects"
            />
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security and connected wallets.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Connected Wallet</div>
                  <div className="text-xs text-muted-foreground font-mono">0x7a3d...8f2c</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Connected</Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground">Add an extra layer of security to your account</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Activity Log</div>
                  <div className="text-xs text-muted-foreground">View recent account activity and login history</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                View Log
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="glass-panel">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="/vortia-logo.png" alt="Vortia AI" className="h-10 w-auto" />
                <div>
                  <div className="text-sm text-muted-foreground">Version 1.0.0</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Powered by Vortia Neural Network</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppSidebar>
  );
}
