import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { marketRouter } from "./marketRouter";
import { newsRouter } from "./newsRouter";
import { userRouter } from "./userRouter";
import { portfolioRouter } from "./portfolioRouter";
import { socialRouter } from "./socialRouter";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Market data and news APIs
  market: marketRouter,
  news: newsRouter,
  user: userRouter,
  portfolio: portfolioRouter,
  social: socialRouter,
});

export type AppRouter = typeof appRouter;
