/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as PrismaClient from "@prisma/client";
import type { Language } from "@prisma/client";
import fs from "fs";
const prisma = new PrismaClient.PrismaClient();

interface QuranAyah {
  number: number; // overall verse number
  text: string;
  numberInSurah: number; // verse number within surah
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface QuranSurah {
  number: number; // surah number
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  revelationType: string; // "Meccan" or "Medinan"
  ayahs: QuranAyah[];
}

const languageBismillah: {
  [key in Language]: string;
} = {
  ARABIC: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
  ENGLISH: "In the name of Allah, the Beneficent, the Merciful.",
  URDU: "",
  FRENCH: "",
};

// Special seed for Qarai source which does not follow the standard quran format
const createQaraiSource = async (
  sourcePath: string,
  language: Language,
  sourceName: string
) => {
  console.log("Creating source: ", sourceName);
  const rawFile = fs.readFileSync(sourcePath, "utf8");
  const surahs = JSON.parse(rawFile) as QuranSurah[];
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
    for (const surah of surahs) {
      const surahNumber = surah.number;

      // Add Bismillah for surahs except 1 and 9, before verse 1
      if (surahNumber !== 1 && surahNumber !== 9) {
        const firstAyah = surah.ayahs[0];
        if (firstAyah && firstAyah.numberInSurah === 1) {
          // Bismillah comes before the first verse, so use the verse's number
          versesData.push({
            overallVerseNumber: firstAyah.number + bismillahsAdded,
            surahNumber,
            verseNumber: 0,
            text: languageBismillah[language],
            source: sourceName,
            language,
          });
          bismillahsAdded++;
        }
      }

      // Add all verses from this surah
      for (const ayah of surah.ayahs) {
        versesData.push({
          overallVerseNumber: ayah.number + bismillahsAdded,
          surahNumber,
          verseNumber: ayah.numberInSurah,
          text: ayah.text,
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
  // Create Qarai source
  await createQaraiSource(
    "./prisma/quranFiles/en-qarai.json",
    "ENGLISH",
    "Ali Quli Qara'i"
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
