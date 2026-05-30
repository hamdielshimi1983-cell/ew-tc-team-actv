import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Placeholder routers for future backend integration
  workflow: router({
    getAllRequests: publicProcedure.query(() => {
      return [];
    }),
    getRequest: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(() => null),
    createRequest: publicProcedure
      .input(z.object({ title: z.string(), description: z.string() }))
      .mutation(() => ({ success: true })),
  }),

  briefs: router({
    getAll: publicProcedure.query(() => []),
    create: publicProcedure
      .input(z.object({ title: z.string() }))
      .mutation(() => ({ success: true })),
  }),

  activityLog: router({
    getAll: publicProcedure.query(() => []),
  }),
});

export type AppRouter = typeof appRouter;
