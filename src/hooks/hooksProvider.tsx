import type { SetStateAction } from "react";
import { createContext, useState } from "react";
import type { SettingsType } from "./useSettings";

export enum PresenterMode {
  "Default" = "Default",
  "Playlist" = "Playlist",
}

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
  mode: PresenterMode.Default,
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

export enum PlaylistItemType {
  Verse = "verse",
}

export interface PlaylistVerseType {
  type: PlaylistItemType.Verse;
  overallVerseNumber: number;
}

export type PlaylistType = PlaylistVerseType[];

export const HookContext = createContext<{
  settings: SettingsType;
  setSettings: (settings: SetStateAction<SettingsType>) => void;
  currentVerseNumber: number;
  setCurrentVerseNumber: (currentVerseNumber: SetStateAction<number>) => void;
  currentVerseData: CurrentVerseDataType;
  setCurrentVerseData: (
    currentVerseData: SetStateAction<CurrentVerseDataType>
  ) => void;
  playlist: PlaylistType;
  setPlaylist: (playlist: SetStateAction<PlaylistType>) => void;
  broadcasterWindowId: string;
}>({
  settings: DefaultSettings,
  setSettings: () => void 0,
  currentVerseNumber: 1,
  setCurrentVerseNumber: () => void 0,
  currentVerseData: {
    previousVerse: undefined,
    currentVerse: undefined,
    nextVerse: undefined,
  },
  setCurrentVerseData: () => void 0,
  broadcasterWindowId: "",
  playlist: [],
  setPlaylist: () => void 0,
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
  const [playlist, setPlaylist] = useState<PlaylistType>([]);

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
        playlist,
        setPlaylist,
        broadcasterWindowId,
      }}
    >
      {children}
    </HookContext.Provider>
  );
};
