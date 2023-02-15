import type { QuranIndex } from "@prisma/client";
import { useCallback } from "react";
import { api } from "../utils/api";

export type SurahDataType =
  | ({
      includeBismillah: boolean;
    } & QuranIndex)
  | undefined;

export const useQuranIndex = () => {
  const quranIndex = api.quranIndex.getQuranIndex.useQuery();

  const getSurahData = useCallback(
    (surahNumber = 1) => {
      const surah = quranIndex?.data?.quranIndex?.find(
        (s) => s.surahNumber === surahNumber
      );

      return {
        ...surah,
        includeBismillah: surah?.surahNumber !== 1 && surah?.surahNumber !== 9,
      } as SurahDataType;
    },
    [quranIndex?.data?.quranIndex]
  );

  return {
    quranIndex,
    getSurahData,
  };
};
