import { quranIndexRouter } from "./routers/quranIndex";
import { versesRouter } from "./routers/verses";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  verses: versesRouter,
  quranIndex: quranIndexRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
