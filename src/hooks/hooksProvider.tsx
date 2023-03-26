/* eslint-disable @typescript-eslint/no-empty-function */
import type { SetStateAction } from "react";
import { createContext, useState } from "react";
import type { SettingsType } from "./useSettings";
import { BroadcastChannel } from "broadcast-channel";

export const DefaultSettings: SettingsType = {
  backgroundColor: "black",
  showArabic: true,
  arabicSource: "Simple Enhanced",
  arabicFontSize: 32,
  arabicFontColor: "white",
  showTranslation: true,
  translationLanguage: "ENGLISH",
  translationSource: "Shakir",
  translationFontSize: 22,
  translationFontColor: "white",
  layout: "Third",
};

export interface OrganizedVerseType {
  overallVerseNumber: number;
  verseNumber: number;
  surahNumber: number;
  ARABIC?: string;
  ENGLISH?: string;
  URDU?: string;
  FRENCH?: string;
}

interface CurrentVerseDataType {
  previousVerse: OrganizedVerseType | undefined;
  currentVerse: OrganizedVerseType | undefined;
  nextVerse: OrganizedVerseType | undefined;
}

export const HookContext = createContext<{
  settings: SettingsType;
  setSettings: (settings: SetStateAction<SettingsType>) => void;
  currentVerseNumber: number;
  setCurrentVerseNumber: (currentVerseNumber: SetStateAction<number>) => void;
  currentVerseData: CurrentVerseDataType;
  setCurrentVerseData: (
    currentVerseData: SetStateAction<CurrentVerseDataType>
  ) => void;
  broadcasterWindowId: string;
}>({
  settings: DefaultSettings,
  setSettings: () => {},
  currentVerseNumber: 1,
  setCurrentVerseNumber: () => {},
  currentVerseData: {
    previousVerse: undefined,
    currentVerse: undefined,
    nextVerse: undefined,
  },
  setCurrentVerseData: () => {},
  broadcasterWindowId: "",
});

export const HookProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SettingsType>({
    ...DefaultSettings,
  });
  const [currentVerseNumber, setCurrentVerseNumber] = useState<number>(1);
  const [currentVerseData, setCurrentVerseData] =
    useState<CurrentVerseDataType>({
      previousVerse: undefined,
      currentVerse: undefined,
      nextVerse: undefined,
    });

  const [broadcasterWindowId] = useState<string>(
    "private-" + Math.random().toString()
  );

  return (
    <HookContext.Provider
      value={{
        settings,
        setSettings,
        currentVerseNumber,
        setCurrentVerseNumber,
        currentVerseData,
        setCurrentVerseData,
        broadcasterWindowId,
      }}
    >
      {children}
    </HookContext.Provider>
  );
};
