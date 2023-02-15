/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as PrismaClient from '@prisma/client'
import fs from 'fs'
const prisma = new PrismaClient.PrismaClient()

interface QuranListEntry {
  id: number
  name: string //arabic
  transliteration: string,
  translation: string,
  type: string,
  total_verses: number,
  link: string,
}

interface QuranVerseEntry {
  id: number
  surah: number
  ayah: number
  verse: string
}

interface QuranVersesObject { 
  [key: string]: {
    [key: string]: {
      [id: number]: QuranVerseEntry
    }
  }
 }

const rawQuranList = fs.readFileSync('./prisma/quranFiles/quranList.json', "utf8");
const quranList = JSON.parse(rawQuranList) as QuranListEntry[];

const rawUthmaniQuran = fs.readFileSync('./prisma/quranFiles/quran-uthmani.json', "utf8");
const uthmaniQuran = JSON.parse(rawUthmaniQuran) as QuranVersesObject;

const rawShakirQuran = fs.readFileSync('./prisma/quranFiles/en-shakir.json', "utf8");
const shakirQuran = JSON.parse(rawShakirQuran) as QuranVersesObject;


async function main() {
  // Remove all previous quran index
  await prisma.quranIndex.deleteMany({
    where: {
      id: {
        gte: 0
      }
    }
  })

  // Insert many verses
  await prisma.quranIndex.createMany({
    data: quranList.map((quranEntry) => {
      return {
        surahNumber: quranEntry.id,
        surahNameArabic: quranEntry.name,
        surahNameTransliteration: quranEntry.transliteration,
        surahNameEnglish: quranEntry.translation,
        type: quranEntry.type === 'meccan' ? "MAKKAH" : "MADINAH",
        versesCount: quranEntry.total_verses,
      }
    })
  })

  // Remove all previous verses
  await prisma.verse.deleteMany({
    where: {
      id: {
        gte: 0
      }
    }
  })

  const uthmaniVersesData: PrismaClient.Prisma.Enumerable<PrismaClient.Prisma.VerseCreateManyInput> = []
  let uthmaniBismillahsAdded = 0

  const shakirVersesData: PrismaClient.Prisma.Enumerable<PrismaClient.Prisma.VerseCreateManyInput>  = []
  let shakirBismillahsAdded = 0

  for (const uthmaniVerseNum in uthmaniQuran?.quran?.['quran-uthmani'] ?? {}) {
    const verse = uthmaniQuran?.quran?.['quran-uthmani']?.[uthmaniVerseNum]

    if (verse) {
      const { id: overallVerseNumber, surah: surahNumber, ayah: verseNumber, verse: text } = verse
      const language = 'ARABIC'
      const source = 'Uthmani'

      if (surahNumber !== 1 && surahNumber !== 9 && verseNumber === 1) {
        uthmaniVersesData.push({
          overallVerseNumber: overallVerseNumber + uthmaniBismillahsAdded,
          surahNumber,
          verseNumber: 0,
          text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
          source,
          language
        })

        uthmaniBismillahsAdded++
      }

  
      uthmaniVersesData.push({
        overallVerseNumber: overallVerseNumber + uthmaniBismillahsAdded,
        surahNumber,
        verseNumber,
        text,
        source,
        language
      })
    }
  }

  for (const shakirVerseNum in shakirQuran?.quran?.['en.shakir'] ?? {}) {
    const verse = shakirQuran?.quran?.['en.shakir']?.[shakirVerseNum]

    if (verse) {
      const { id: overallVerseNumber, surah: surahNumber, ayah: verseNumber, verse: text } = verse
      const language = 'ENGLISH'
      const source = 'Shakir'

      if (surahNumber !== 1 && surahNumber !== 9 && verseNumber === 1) {
        shakirVersesData.push({
          overallVerseNumber: overallVerseNumber + shakirBismillahsAdded,
          surahNumber,
          verseNumber: 0,
          text: 'In the name of Allah, the Beneficent, the Merciful.',
          source,
          language
        })

        shakirBismillahsAdded++
      }
  
      shakirVersesData.push({
        overallVerseNumber: overallVerseNumber + shakirBismillahsAdded,
        surahNumber,
        verseNumber,
        text,
        source,
        language
      })
    }
  }

  const uthmaniVerses = await prisma.verse.createMany({
    data: uthmaniVersesData
  })

  const shakirVerses = await prisma.verse.createMany({
    data: shakirVersesData
  })

  return { uthmaniVerses, shakirVerses }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })