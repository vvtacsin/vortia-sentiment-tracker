import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock fetch for CoinGecko API
const mockFetch = vi.fn();
global.fetch = mockFetch;

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("market router", () => {
  it("getAssets returns fallback data when API is rate limited", async () => {
    // Mock rate limit response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const assets = await caller.market.getAssets();

    // Should return fallback data
    expect(assets).toBeDefined();
    expect(Array.isArray(assets)).toBe(true);
    expect(assets.length).toBeGreaterThan(0);
    
    // Check structure of first asset
    const firstAsset = assets[0];
    expect(firstAsset).toHaveProperty("id");
    expect(firstAsset).toHaveProperty("symbol");
    expect(firstAsset).toHaveProperty("name");
    expect(firstAsset).toHaveProperty("price");
    expect(firstAsset).toHaveProperty("change24h");
    expect(firstAsset).toHaveProperty("sentimentScore");
    expect(firstAsset).toHaveProperty("sentimentTrend");
    expect(firstAsset).toHaveProperty("history");
  });

  it("getAssets includes VAI token in results", async () => {
    // Mock rate limit to use fallback
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const assets = await caller.market.getAssets();

    // Should include VAI token
    const vaiToken = assets.find((a: any) => a.symbol === "VAI");
    expect(vaiToken).toBeDefined();
    expect(vaiToken?.name).toBe("Vortia AI");
    expect(vaiToken?.price).toBe(0.85);
  });

  it("getGlobalStats returns default values when API fails", async () => {
    // Mock rate limit response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.market.getGlobalStats();

    // Should return default values
    expect(stats).toBeDefined();
    expect(stats.marketSentiment).toBe(68);
    expect(stats.aiQueries24h).toBe("2.4M");
    expect(stats.totalMarketCap).toBeGreaterThan(0);
  });

  it("sentiment score is calculated correctly", async () => {
    // Mock rate limit to use fallback
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const assets = await caller.market.getAssets();

    // All sentiment scores should be between 0 and 100
    for (const asset of assets) {
      expect(asset.sentimentScore).toBeGreaterThanOrEqual(0);
      expect(asset.sentimentScore).toBeLessThanOrEqual(100);
    }
  });

  it("sentiment trend is correctly categorized", async () => {
    // Mock rate limit to use fallback
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const assets = await caller.market.getAssets();

    // All sentiment trends should be valid
    const validTrends = ["bullish", "bearish", "neutral"];
    for (const asset of assets) {
      expect(validTrends).toContain(asset.sentimentTrend);
    }
  });
});
