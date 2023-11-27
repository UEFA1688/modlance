import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from '~/server/api/routers/userRouter';
import { commentRouter } from '~/server/api/routers/commentRouter';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
