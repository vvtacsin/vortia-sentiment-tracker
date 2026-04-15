import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Newspaper, Loader2 } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
  symbol: string;
  timestamp: string;
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function NewsFeed() {
  const { data: news, isLoading, error } = trpc.news.getNews.useQuery(
    { limit: 6 },
    {
      refetchInterval: 120000, // Refresh every 2 minutes
    }
  );

  return (
    <Card className="glass-panel h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-base">
          <Newspaper className="w-4 h-4 text-primary" />
          Live News Sentiment
          {isLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {error && (
          <div className="p-4 text-red-400 text-sm">Failed to load news</div>
        )}
        <div className="divide-y divide-white/5">
          {news?.map((item: NewsItem) => (
            <div 
              key={item.id} 
              className="block p-4 hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <Badge 
                  variant="outline" 
                  className="text-[10px] h-5 px-1.5 border-0 shrink-0 bg-white/5 text-muted-foreground"
                >
                  {item.symbol}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(item.timestamp)}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`
                    text-[10px] h-5 px-1.5 border-0
                    ${item.sentiment === 'positive' ? 'bg-green-500/10 text-green-400' : 
                      item.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' : 
                      'bg-yellow-500/10 text-yellow-400'}
                  `}
                >
                  {item.sentiment.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
