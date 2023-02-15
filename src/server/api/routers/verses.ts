import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "../../db";

export const versesRouter = createTRPCRouter({
  getVerseByOverallVerseNumber: publicProcedure
    .input(
      z.object({
        overallVerseNumber: z.number(),
        sources: z.array(z.string()).default(["Uthmani", "Shakir"]),
        numVersesBefore: z.number().default(2),
        numVersesAfter: z.number().default(2),
      })
    )
    .query(async ({ input }) => {
      const { overallVerseNumber, sources, numVersesAfter, numVersesBefore } =
        input;

      const verse = await prisma?.verse.groupBy({
        by: [
          "overallVerseNumber",
          "verseNumber",
          "surahNumber",
          "text",
          "language",
          "source",
        ],
        orderBy: [
          {
            overallVerseNumber: "asc",
          },
        ],
        where: {
          overallVerseNumber: {
            gte: overallVerseNumber - numVersesBefore,
            lte: overallVerseNumber + numVersesAfter,
          },
          source: {
            in: sources,
          },
        },
      });

      const organizedVerses: {
        overallVerseNumber: number;
        surahNumber: number;
        verseNumber: number;
        ARABIC?: string;
        ENGLISH?: string;
        URDU?: string;
        FRENCH?: string;
      }[] = [];

      verse?.forEach((v) => {
        const verse = organizedVerses.find(
          (vv) => vv.overallVerseNumber === v.overallVerseNumber
        );

        if (verse) {
          verse[v.language] = v.text;
        } else {
          organizedVerses.push({
            ...v,
            [v.language]: v.text,
          });
        }
      });

      return {
        verse: organizedVerses,
      };
    }),
  getSourcesByLanguage: publicProcedure
    .input(
      z.object({
        language: z.enum(["ARABIC", "ENGLISH"]),
      })
    )
    .query(async ({ input }) => {
      const { language } = input;

      return {
        sources: await prisma?.verse.groupBy({
          by: ["source"],
          where: {
            language,
          },
        }),
      };
    }),
  searchText: publicProcedure
    .input(
      z.object({
        text: z.string(),
        take: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const { text, take } = input;

      return {
        verses: await prisma?.verse.findMany({
          where: {
            text: {
              contains: text,
              mode: "insensitive",
            },
          },
          take,
        }),
      };
    }),
});
