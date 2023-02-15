import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "../../db";

export const quranIndexRouter = createTRPCRouter({
  getQuranIndex: publicProcedure.query(async () => {
    const quranIndex = await prisma?.quranIndex.findMany();
    return {
      quranIndex,
    };
  }),
});
