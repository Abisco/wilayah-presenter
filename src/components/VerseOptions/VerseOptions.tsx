import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect } from "react";
import { useQuranIndex } from "../../hooks/useQuranIndex";
import { useVerseData } from "../../hooks/useVerseData";
import { Combobox } from "../Combobox/Combobox";
import { OptionsBox } from "../OptionsBox/OptionsBox";

export const VerseOptions = () => {
  const [surah, setSurah] = React.useState(1);
  const [ayah, setAyah] = React.useState(1);
  const [currentAyahs, setCurrentAyahs] = React.useState(
    Array(7)
      .fill(0)
      .map((_, i) => i + 1)
  );

  const surahRef = React.useRef<HTMLInputElement>(null);
  const ayahRef = React.useRef<HTMLInputElement>(null);
  const presentRef = React.useRef<HTMLButtonElement>(null);

  const { quranIndex, getSurahData } = useQuranIndex();
  const { currentVerse, calculateOverallVerseNumber, setCurrentVerseNumber } =
    useVerseData();

  const setSurahNumber = useCallback(
    (surahNumber: number) => {
      const surahInfo = getSurahData(surahNumber);
      // If surah doesn't need bismillah added,
      const includesBismillah: number =
        surahNumber === 1 || surahNumber === 9 ? 0 : 1;

      if (!surahInfo) {
        return;
      }

      const numVerses = surahInfo?.versesCount + includesBismillah;

      if (numVerses) {
        const ayahs = Array(numVerses)
          .fill(0)
          .map((_, i) => i - includesBismillah + 1);

        setCurrentAyahs(ayahs);
      }
    },
    [getSurahData]
  );

  useEffect(() => {
    if (currentVerse) {
      setSurah(currentVerse.surahNumber);
      setSurahNumber(currentVerse.surahNumber);
      setAyah(currentVerse.verseNumber);
    }
  }, [currentVerse, setSurahNumber]);

  const presentVerse = () => {
    const overallVerseNumber = calculateOverallVerseNumber(surah, ayah);

    setCurrentVerseNumber(overallVerseNumber);
  };

  const handleUserTyping = useCallback((e: KeyboardEvent) => {
    if (
      e.key.match(/^[0-9a-z]+$/) &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !e.shiftKey
    ) {
      const activeElement = document.activeElement;
      const inputs = ["input", "select", "textarea"];

      const focusedInputs =
        activeElement &&
        inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1;

      if (!focusedInputs) {
        if (surahRef.current && document.activeElement !== surahRef.current)
          surahRef.current.value = "";
        surahRef.current?.focus();
      }
    }
  }, []);

  const handleSurahChange = (surahNumber: number) => {
    setSurah(surahNumber);
    setSurahNumber(surahNumber);
    if (ayahRef.current) ayahRef.current.value = "";
    ayahRef.current?.focus();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleUserTyping);

    return () => {
      document.removeEventListener("keydown", handleUserTyping);
    };
  }, [handleUserTyping]);

  return (
    <OptionsBox
      icon={<DocumentPlusIcon />}
      name="Select Verse"
      expandable={false}
    >
      <form
        className="flex gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          presentVerse;
        }}
      >
        <div className="flex flex-col gap-1">
          <Combobox
            items={(quranIndex.data?.quranIndex || []).map((surah) => {
              return {
                label: `${surah.surahNumber}. Surah ${surah.surahNameTransliteration}`,
                value: surah.surahNumber.toString(),
              };
            })}
            selected={surah.toString()}
            onSelect={(selectedSurah) => {
              handleSurahChange(parseInt(selectedSurah.value));
            }}
            inputRef={surahRef}
          />
          <Combobox
            items={currentAyahs.map((ayahChoice) => {
              return {
                label: `Verse ${ayahChoice}`,
                value: `${ayahChoice}`,
              };
            })}
            selected={ayah.toString()}
            onSelect={(selectedAyah) => {
              setAyah(parseInt(selectedAyah.value));
              presentRef.current?.focus();
            }}
            onSubmit={presentVerse}
            inputRef={ayahRef}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <button
            disabled
            className="w-[124px] items-center justify-center rounded-md bg-[#1E277C] py-1 px-2 font-bold text-white disabled:text-gray-400"
          >
            <span className="text-sm text-inherit">Add to Playlist</span>
          </button>
          <button
            type="submit"
            onClick={presentVerse}
            ref={presentRef}
            className="w-[124px] items-center justify-center rounded-md bg-[#018F0F] py-1 font-bold text-white focus-within:outline-2 focus-within:outline-red-500"
          >
            <span className="text-sm text-inherit">Present now</span>
          </button>
        </div>
      </form>
    </OptionsBox>
  );
};
