import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "../../db";
import type { Language } from "@prisma/client";

export const quranIndexRouter = createTRPCRouter({
  getQuranIndex: publicProcedure.query(async () => {
    const quranIndex = await prisma?.quranIndex.findMany();
    return {
      quranIndex,
    };
  }),
  getSources: publicProcedure.query(async () => {
    const sources: {
      [k in Language]?: string[];
    } = {};

    const verses_by_source = await prisma?.verse.findMany({
      where: {
        surahNumber: 1,
        verseNumber: 1,
      },
    });

    verses_by_source?.forEach((verse) => {
      if (!sources[verse.language]) {
        sources[verse.language] = [verse.source];
      } else {
        sources[verse.language]?.push(verse.source);
      }
    });

    return sources;
  }),
});
