import { useCallback, useContext } from "react";
import { api } from "../utils/api";
import { useBroadcastHandlerHook } from "./broadcastHandlerHook";
import { HookContext } from "./hooksProvider";
import { useQuranIndex } from "./useQuranIndex";
import { useSettings } from "./useSettings";
import { devLogger } from "../utils/devUtils";

/*
  This hook will fetch the verse data from the API
*/
export const useVerseData = () => {
  const { getSources } = useSettings();
  const { quranIndex } = useQuranIndex();
  const { sendBroadcast } = useBroadcastHandlerHook();

  const {
    currentVerseNumber,
    setCurrentVerseNumber,
    currentVerseData,
    setCurrentVerseData,
  } = useContext(HookContext);

  const verse = api.verses.getVerseByOverallVerseNumber.useQuery(
    {
      overallVerseNumber: currentVerseNumber,
      sources: getSources(),
      numVersesBefore: 10,
      numVersesAfter: 10,
    },
    {
      onSettled(data) {
        setCurrentVerseData({
          previousVerse: data?.verse?.find(
            (v) => v.overallVerseNumber === currentVerseNumber - 1
          ),
          currentVerse: data?.verse?.find(
            (v) => v.overallVerseNumber === currentVerseNumber
          ),
          nextVerse: data?.verse?.find(
            (v) => v.overallVerseNumber === currentVerseNumber + 1
          ),
        });
      },
    }
  );

  /*
    Given a number of how much to change the verse by, this function will update the current verse number
    and fetch the new verse data from the API
  */
  const changeVerseLocally = useCallback(
    (verseNumberChange: 1 | -1, updateChannels = true) => {
      const newVerseNumber = currentVerseNumber + verseNumberChange;

      if (verseNumberChange === 1 && !currentVerseData.nextVerse) {
        return;
      } else if (verseNumberChange === -1 && !currentVerseData.previousVerse) {
        return;
      }

      if (updateChannels) {
        sendBroadcast("verseNumberChange", {
          currentVerseNumber: newVerseNumber,
        });

        devLogger("Local Storage: Set verse number", newVerseNumber.toString());
        localStorage.setItem("currentVerseNumber", newVerseNumber.toString());
      }

      setCurrentVerseData({
        currentVerse: verse.data?.verse?.find(
          (v) => v.overallVerseNumber === newVerseNumber
        ),
        previousVerse: verse.data?.verse?.find(
          (v) => v.overallVerseNumber === currentVerseNumber - 1
        ),
        nextVerse: verse.data?.verse?.find(
          (v) => v.overallVerseNumber === currentVerseNumber + 1
        ),
      });

      setCurrentVerseNumber(newVerseNumber);
    },
    [
      currentVerseData.nextVerse,
      currentVerseData.previousVerse,
      currentVerseNumber,
      sendBroadcast,
      setCurrentVerseData,
      setCurrentVerseNumber,
      verse.data?.verse,
    ]
  );

  const calculateOverallVerseNumber = useCallback(
    (surahNumber: number, verseNumber: number) => {
      const surahsBefore = quranIndex?.data?.quranIndex?.filter(
        (s) => s.surahNumber < surahNumber
      );

      const versesBefore = surahsBefore?.reduce((acc, surah) => {
        if (surah.surahNumber !== 1 && surah.surahNumber !== 9) {
          return acc + surah.versesCount + 1;
        }

        return acc + surah.versesCount;
      }, 0);

      if (!versesBefore) return verseNumber;

      if (surahNumber !== 1 && surahNumber !== 9) {
        return versesBefore + verseNumber + 1;
      }

      return versesBefore + verseNumber;
    },
    [quranIndex?.data?.quranIndex]
  );

  const updateCurrentVerseNumber = useCallback(
    (newVerseNumber: number, updateChannels = true) => {
      setCurrentVerseNumber(newVerseNumber);
      if (updateChannels) {
        sendBroadcast("verseNumberChange", {
          currentVerseNumber: newVerseNumber,
        });

        devLogger("Local Storage: Set verse number", newVerseNumber.toString());
        localStorage.setItem("currentVerseNumber", newVerseNumber.toString());
      }
    },
    [sendBroadcast, setCurrentVerseNumber]
  );

  return {
    ...currentVerseData,
    changeVerseLocally,
    currentVerseNumber,
    setCurrentVerseNumber: updateCurrentVerseNumber,
    calculateOverallVerseNumber,
    verseData: verse,
  };
};
