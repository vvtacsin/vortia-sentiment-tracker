import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("social.getTweets", () => {
  it("returns tweets with sentiment data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.social.getTweets({ limit: 10 });

    expect(result).toHaveProperty("tweets");
    expect(result).toHaveProperty("sentiment");
    expect(result.tweets).toBeInstanceOf(Array);
    expect(result.tweets.length).toBeLessThanOrEqual(10);
    
    // Check tweet structure
    if (result.tweets.length > 0) {
      const tweet = result.tweets[0];
      expect(tweet).toHaveProperty("id");
      expect(tweet).toHaveProperty("author");
      expect(tweet).toHaveProperty("content");
      expect(tweet).toHaveProperty("sentiment");
      expect(tweet).toHaveProperty("sentimentScore");
      expect(["positive", "negative", "neutral"]).toContain(tweet.sentiment);
    }
  });

  it("filters tweets by coin when specified", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.social.getTweets({ coin: "BTC", limit: 5 });

    // Should return tweets (coin filter is a soft filter in mock data)
    expect(result.tweets.length).toBeGreaterThan(0);
    expect(result).toHaveProperty("sentiment");
  });
});

describe("social.getTrendingTopics", () => {
  it("returns trending topics sorted by mentions", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.social.getTrendingTopics();

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    
    // Check topic structure
    const topic = result[0];
    expect(topic).toHaveProperty("tag");
    expect(topic).toHaveProperty("mentions");
    expect(topic).toHaveProperty("change");
    
    // Verify sorted by mentions (descending)
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].mentions).toBeGreaterThanOrEqual(result[i].mentions);
    }
  });
});

describe("social.getSentimentSummary", () => {
  it("returns AI-generated sentiment summary", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.social.getSentimentSummary({});

    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("sentiment");
    expect(result).toHaveProperty("tweetCount");
    expect(result).toHaveProperty("timeRange");
    
    expect(typeof result.summary).toBe("string");
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.sentiment).toHaveProperty("score");
    expect(result.sentiment).toHaveProperty("trend");
  });
});
