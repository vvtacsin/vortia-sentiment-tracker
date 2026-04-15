import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { userProfiles, activityLog } from "../drizzle/schema";
import { eq, sql, desc } from "drizzle-orm";

export const userRouter = router({
  // Get or create user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const userId = ctx.user.id;
    
    // Try to find existing profile
    const profiles = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    
    if (profiles.length > 0) {
      return profiles[0];
    }
    
    // Create new profile with welcome bonus
    await db
      .insert(userProfiles)
      .values({
        userId,
        vortiaPoints: 100, // Welcome bonus
        totalLogins: 1,
      });
    
    // Log the welcome bonus
    await db.insert(activityLog).values({
      userId,
      action: "welcome_bonus",
      pointsEarned: 100,
      metadata: JSON.stringify({ reason: "New user welcome bonus" }),
    });
    
    // Fetch the created profile
    const newProfiles = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    
    return newProfiles[0];
  }),

  // Update wallet address
  updateWallet: protectedProcedure
    .input(z.object({
      walletAddress: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user.id;
      
      // Check if profile exists
      const existingProfiles = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));
      
      if (existingProfiles.length > 0) {
        const existingProfile = existingProfiles[0];
        
        // Update existing profile
        await db
          .update(userProfiles)
          .set({ walletAddress: input.walletAddress })
          .where(eq(userProfiles.userId, userId));
        
        // Award points for connecting wallet if first time
        if (!existingProfile.walletAddress) {
          await db
            .update(userProfiles)
            .set({ vortiaPoints: sql`${userProfiles.vortiaPoints} + 50` })
            .where(eq(userProfiles.userId, userId));
          
          await db.insert(activityLog).values({
            userId,
            action: "wallet_connected",
            pointsEarned: 50,
            metadata: JSON.stringify({ wallet: input.walletAddress }),
          });
        }
        
        const updated = await db
          .select()
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId));
        
        return updated[0];
      } else {
        // Create new profile with wallet
        await db
          .insert(userProfiles)
          .values({
            userId,
            walletAddress: input.walletAddress,
            vortiaPoints: 150, // Welcome bonus + wallet bonus
            totalLogins: 1,
          });
        
        await db.insert(activityLog).values({
          userId,
          action: "welcome_bonus",
          pointsEarned: 150,
          metadata: JSON.stringify({ reason: "New user + wallet connection bonus" }),
        });
        
        const newProfiles = await db
          .select()
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId));
        
        return newProfiles[0];
      }
    }),

  // Claim daily bonus
  claimDailyBonus: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const userId = ctx.user.id;
    
    const profiles = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    
    if (profiles.length === 0) {
      throw new Error("Profile not found");
    }
    
    const profile = profiles[0];
    
    // Check if daily bonus already claimed
    const now = new Date();
    const lastBonus = profile.lastDailyBonus;
    
    if (lastBonus) {
      const hoursSinceLastBonus = (now.getTime() - new Date(lastBonus).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastBonus < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastBonus);
        throw new Error(`Daily bonus available in ${hoursRemaining} hours`);
      }
    }
    
    // Award daily bonus (10-50 points based on streak)
    const bonusAmount = Math.min(50, 10 + (profile.totalLogins * 2));
    
    await db
      .update(userProfiles)
      .set({
        vortiaPoints: sql`${userProfiles.vortiaPoints} + ${bonusAmount}`,
        totalLogins: sql`${userProfiles.totalLogins} + 1`,
        lastDailyBonus: now,
      })
      .where(eq(userProfiles.userId, userId));
    
    await db.insert(activityLog).values({
      userId,
      action: "daily_bonus",
      pointsEarned: bonusAmount,
      metadata: JSON.stringify({ streak: profile.totalLogins + 1 }),
    });
    
    const updated = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    
    return {
      pointsEarned: bonusAmount,
      newTotal: updated[0]?.vortiaPoints || 0,
      streak: updated[0]?.totalLogins || 0,
    };
  }),

  // Award points for activity
  awardPoints: protectedProcedure
    .input(z.object({
      action: z.string(),
      points: z.number().min(1).max(100),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user.id;
      
      await db
        .update(userProfiles)
        .set({
          vortiaPoints: sql`${userProfiles.vortiaPoints} + ${input.points}`,
        })
        .where(eq(userProfiles.userId, userId));
      
      await db.insert(activityLog).values({
        userId,
        action: input.action,
        pointsEarned: input.points,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      });
      
      const updated = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));
      
      return {
        pointsEarned: input.points,
        newTotal: updated[0]?.vortiaPoints || 0,
      };
    }),

  // Get activity history
  getActivityHistory: protectedProcedure
    .input(z.object({
      limit: z.number().optional().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const userId = ctx.user.id;
      
      const activities = await db
        .select()
        .from(activityLog)
        .where(eq(activityLog.userId, userId))
        .orderBy(desc(activityLog.createdAt))
        .limit(input.limit);
      
      return activities;
    }),

  // Get leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(10),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const leaders = await db
        .select({
          walletAddress: userProfiles.walletAddress,
          vortiaPoints: userProfiles.vortiaPoints,
          totalLogins: userProfiles.totalLogins,
        })
        .from(userProfiles)
        .orderBy(desc(userProfiles.vortiaPoints))
        .limit(input.limit);
      
      return leaders.map((leader, index) => ({
        rank: index + 1,
        walletAddress: leader.walletAddress 
          ? `${leader.walletAddress.slice(0, 6)}...${leader.walletAddress.slice(-4)}`
          : "Anonymous",
        vortiaPoints: leader.vortiaPoints,
        totalLogins: leader.totalLogins,
      }));
    }),
});
