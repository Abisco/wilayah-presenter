/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as PrismaClient from "@prisma/client";
import type { Language } from "@prisma/client";
import fs from "fs";
const prisma = new PrismaClient.PrismaClient();

interface QuranListEntry {
  id: number;
  name: string; //arabic
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
  link: string;
}

interface QuranVerseEntry {
  id: number;
  surah: number;
  ayah: number;
  verse: string;
}

interface QuranVersesObject {
  [key: string]: {
    [key: string]: {
      [id: number]: QuranVerseEntry;
    };
  };
}

const rawQuranList = fs.readFileSync(
  "./prisma/quranFiles/quranList.json",
  "utf8"
);
const quranList = JSON.parse(rawQuranList) as QuranListEntry[];

const languageBismillah: {
  [key in Language]: string;
} = {
  ARABIC: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
  ENGLISH: "In the name of Allah, the Beneficent, the Merciful.",
  URDU: "",
  FRENCH: "",
};

const createSource = async (
  sourcePath: string,
  language: Language,
  sourceKey: string,
  sourceName: string
) => {
  console.log("Creating source: ", sourceName);
  const rawFile = fs.readFileSync(sourcePath, "utf8");
  const sourceObject = JSON.parse(rawFile) as QuranVersesObject;
  const versesData: PrismaClient.Prisma.Enumerable<PrismaClient.Prisma.VerseCreateManyInput> =
    [];
  let bismillahsAdded = 0;

  // Check if the source exists
  const sourceExists = await prisma.verse.findFirst({
    where: {
      source: sourceName,
      surahNumber: 1,
    },
  });

  if (!sourceExists) {
    for (const verseNum in sourceObject?.quran?.[sourceKey] ?? {}) {
      const verse = sourceObject?.quran?.[sourceKey]?.[verseNum];

      if (verse) {
        const {
          id: overallVerseNumber,
          surah: surahNumber,
          ayah: verseNumber,
          verse: text,
        } = verse;

        if (surahNumber !== 1 && surahNumber !== 9 && verseNumber === 1) {
          versesData.push({
            overallVerseNumber: overallVerseNumber + bismillahsAdded,
            surahNumber,
            verseNumber: 0,
            text: languageBismillah[language],
            source: sourceName,
            language,
          });

          bismillahsAdded++;
        }

        versesData.push({
          overallVerseNumber: overallVerseNumber + bismillahsAdded,
          surahNumber,
          verseNumber,
          text,
          source: sourceName,
          language,
        });
      }
    }

    await prisma.verse.createMany({
      data: versesData,
    });

    console.log("Source created: ", sourceName);
    return "Source created!";
  } else {
    console.log("Source already exists: ", sourceName);
    return "Source already exists!";
  }
};

async function main() {
  // Remove all previous quran index
  await prisma.$transaction(async (tx) => {
    const firstEntry = await tx.quranIndex.findFirst({
      where: {
        surahNameArabic: quranList[0]?.name,
        surahNameEnglish: quranList[0]?.translation,
        surahNameTransliteration: quranList[0]?.transliteration,
      },
    });

    if (!firstEntry) {
      // Insert many verses
      await tx.quranIndex.createMany({
        data: quranList.map((quranEntry) => {
          return {
            surahNumber: quranEntry.id,
            surahNameArabic: quranEntry.name,
            surahNameTransliteration: quranEntry.transliteration,
            surahNameEnglish: quranEntry.translation,
            type: quranEntry.type === "meccan" ? "MAKKAH" : "MADINAH",
            versesCount: quranEntry.total_verses,
          };
        }),
      });

      console.log("Quran index created!");
      return "Success";
    }
    {
      console.log("Quran index already exists!");
      return "Already exists";
    }
  });

  // Arabic sources
  await createSource(
    "./prisma/quranFiles/quran-uthmani.json",
    "ARABIC",
    "quran-uthmani",
    "Uthmani"
  );
  await createSource(
    "./prisma/quranFiles/quran-simple-enhanced.json",
    "ARABIC",
    "quran-simple-enhanced",
    "Simple Enhanced"
  );

  /*
  await createSource(
    "./prisma/quranFiles/quran-tajweed.json",
    "ARABIC",
    "quran-tajweed",
    "Tajweed"
  );
  await createSource(
    "./prisma/quranFiles/quran-wordbyword.json",
    "ARABIC",
    "quran-wordbyword",
    "Word by Word"
  );
  */

  // English sources
  await createSource(
    "./prisma/quranFiles/en-shakir.json",
    "ENGLISH",
    "en.shakir",
    "Shakir"
  );
  await createSource(
    "./prisma/quranFiles/en-yusufali.json",
    "ENGLISH",
    "en.yusufali",
    "Yusuf Ali"
  );
  await createSource(
    "./prisma/quranFiles/en-sahih.json",
    "ENGLISH",
    "en.sahih",
    "Sahih International"
  );

  return "Success!";
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
