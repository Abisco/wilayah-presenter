import { createTRPCRouter, publicProcedure } from "../trpc";

export const quranIndexRouter = createTRPCRouter({
  getQuranIndex: publicProcedure
    .query(async () => {
      const quranIndex = await prisma?.quranIndex.findMany()
      return {
        quranIndex
    }})
});
