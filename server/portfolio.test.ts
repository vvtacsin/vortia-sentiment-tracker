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

describe("portfolio.analyzeRisk", () => {
  it("returns risk metrics for a portfolio", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.analyzeRisk({
      holdings: [
        { symbol: "BTC", amount: 1 },
        { symbol: "ETH", amount: 10 },
        { symbol: "SOL", amount: 50 },
      ],
    });

    expect(result).toHaveProperty("overallScore");
    expect(result).toHaveProperty("diversificationScore");
    expect(result).toHaveProperty("volatilityScore");
    expect(result).toHaveProperty("correlationScore");
    expect(result).toHaveProperty("liquidityScore");
    expect(result).toHaveProperty("concentrationScore");
    expect(result).toHaveProperty("aiInsight");
    expect(result).toHaveProperty("strengths");
    expect(result).toHaveProperty("recommendations");

    // Scores should be between 0 and 100
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.diversificationScore).toBeGreaterThanOrEqual(0);
    expect(result.diversificationScore).toBeLessThanOrEqual(100);
  });

  it("returns default scores for empty portfolio", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.analyzeRisk({
      holdings: [],
    });

    expect(result.overallScore).toBe(50);
    expect(result.aiInsight).toBeNull();
    expect(result.recommendations).toContain("Add holdings to analyze your portfolio");
  });

  it("calculates higher diversification for more assets", { timeout: 15000 }, async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const singleAsset = await caller.portfolio.analyzeRisk({
      holdings: [{ symbol: "BTC", amount: 1 }],
    });

    const multipleAssets = await caller.portfolio.analyzeRisk({
      holdings: [
        { symbol: "BTC", amount: 1 },
        { symbol: "ETH", amount: 5 },
        { symbol: "SOL", amount: 20 },
        { symbol: "ADA", amount: 100 },
      ],
    });

    expect(multipleAssets.diversificationScore).toBeGreaterThan(singleAsset.diversificationScore);
  });

  it("returns AI insight for valid portfolio", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.analyzeRisk({
      holdings: [
        { symbol: "BTC", amount: 0.5 },
        { symbol: "ETH", amount: 5 },
      ],
    });

    expect(result.aiInsight).toBeTruthy();
    expect(typeof result.aiInsight).toBe("string");
    expect(result.aiInsight!.length).toBeGreaterThan(20);
  });

  it("returns strengths and recommendations arrays", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.analyzeRisk({
      holdings: [
        { symbol: "BTC", amount: 1 },
        { symbol: "ETH", amount: 10 },
      ],
    });

    expect(result.strengths).toBeInstanceOf(Array);
    expect(result.recommendations).toBeInstanceOf(Array);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});
