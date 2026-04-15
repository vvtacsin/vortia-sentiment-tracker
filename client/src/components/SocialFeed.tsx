import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Twitter, 
  Heart, 
  Repeat2, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Loader2,
  Cpu,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SocialFeedProps {
  coin?: string;
  compact?: boolean;
}

export function SocialFeed({ coin, compact = false }: SocialFeedProps) {
  const [selectedCoin, setSelectedCoin] = useState<string | undefined>(coin);

  // Fetch tweets
  const { data: tweetData, isLoading, refetch, isFetching } = trpc.social.getTweets.useQuery(
    { coin: selectedCoin, limit: compact ? 10 : 20 },
    { refetchInterval: 60000 } // Refresh every minute
  );

  // Fetch AI summary
  const { data: summaryData, isLoading: summaryLoading } = trpc.social.getSentimentSummary.useQuery(
    { coin: selectedCoin },
    { enabled: !compact }
  );

  // Fetch trending topics
  const { data: trendingTopics } = trpc.social.getTrendingTopics.useQuery(undefined, {
    enabled: !compact,
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'negative':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (compact) {
    return (
      <Card className="glass-panel h-full flex flex-col">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              Social Sentiment
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                tweetData?.tweets.slice(0, 5).map((tweet: any) => (
                  <div key={tweet.id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{tweet.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-medium text-sm truncate">{tweet.author}</span>
                          {tweet.verified && <CheckCircle className="w-3 h-3 text-blue-400 shrink-0" />}
                          <Badge variant="outline" className={`text-[10px] h-4 px-1 ml-auto shrink-0 ${getSentimentColor(tweet.sentiment)}`}>
                            {getSentimentIcon(tweet.sentiment)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-2">{tweet.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {formatNumber(tweet.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat2 className="w-3 h-3" />
                            {formatNumber(tweet.retweets)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Summary Card */}
      <Card className="glass-panel">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Vortia AI Social Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {summaryLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Analyzing social sentiment...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-black/20 rounded-xl p-4 border border-white/5 relative">
                <div className="absolute -left-[1px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-primary to-transparent rounded-r-full"></div>
                <p className="text-gray-300 leading-relaxed">{summaryData?.summary}</p>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{summaryData?.sentiment.score || 0}</div>
                  <div className="text-xs text-muted-foreground">Sentiment Score</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{summaryData?.sentiment.positive || 0}</div>
                  <div className="text-xs text-muted-foreground">Positive</div>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">{summaryData?.sentiment.negative || 0}</div>
                  <div className="text-xs text-muted-foreground">Negative</div>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{summaryData?.sentiment.neutral || 0}</div>
                  <div className="text-xs text-muted-foreground">Neutral</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tweet Feed */}
        <Card className="glass-panel lg:col-span-2">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                Live Social Feed
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-white/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  tweetData?.tweets.map((tweet: any) => (
                    <div key={tweet.id} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shrink-0">
                          {tweet.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white">{tweet.author}</span>
                            {tweet.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                            <span className="text-sm text-muted-foreground">{tweet.handle}</span>
                            <span className="text-sm text-muted-foreground">·</span>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(tweet.timestamp), { addSuffix: true })}
                            </span>
                            <Badge variant="outline" className={`ml-auto ${getSentimentColor(tweet.sentiment)}`}>
                              {getSentimentIcon(tweet.sentiment)}
                              <span className="ml-1 capitalize">{tweet.sentiment}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-3">{tweet.content}</p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2 hover:text-red-400 cursor-pointer transition-colors">
                              <Heart className="w-4 h-4" />
                              {formatNumber(tweet.likes)}
                            </span>
                            <span className="flex items-center gap-2 hover:text-green-400 cursor-pointer transition-colors">
                              <Repeat2 className="w-4 h-4" />
                              {formatNumber(tweet.retweets)}
                            </span>
                            <div className="ml-auto flex items-center gap-1">
                              {tweet.coins.map((c: string) => (
                                <Badge key={c} variant="secondary" className="text-xs bg-primary/10 text-primary">
                                  ${c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card className="glass-panel">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {trendingTopics?.map((topic: any, index: number) => (
                <div 
                  key={topic.tag}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-5">{index + 1}</span>
                    <div>
                      <div className="font-medium text-white">{topic.tag}</div>
                      <div className="text-xs text-muted-foreground">{formatNumber(topic.mentions)} mentions</div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={topic.change >= 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}
                  >
                    {topic.change >= 0 ? '+' : ''}{topic.change.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
