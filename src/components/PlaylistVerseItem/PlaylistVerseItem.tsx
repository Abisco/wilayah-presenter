import React from "react";
import { twMerge } from "tailwind-merge";
import { usePlaylist } from "../../hooks/usePlaylist";
import { useSettings } from "../../hooks/useSettings";
import type { PlaylistVerseType } from "../../hooks/hooksProvider";
import { PresenterMode } from "../../hooks/hooksProvider";
import { api } from "../../utils/api";
import { LoadingIcon } from "../LoadingIcon/LoadingIcon";
import { useVerseData } from "../../hooks/useVerseData";
import { useQuranIndex } from "../../hooks/useQuranIndex";
import { XCircleIcon } from "@heroicons/react/20/solid";

interface PlaylistVerseItemProps {
  index: number;
  verse: PlaylistVerseType;
}

export const PlaylistVerseItem = ({ index, verse }: PlaylistVerseItemProps) => {
  const { updateSettings, getSources, settings } = useSettings();
  const { currentVerseNumber, setCurrentVerseNumber } = useVerseData();
  const { getSurahData } = useQuranIndex();
  const { removeFromPlaylist, playlist } = usePlaylist();

  const verseData = api.verses.getVerseByOverallVerseNumber.useQuery({
    overallVerseNumber: verse?.overallVerseNumber,
    sources: getSources(),
    numVersesBefore: 0,
    numVersesAfter: 0,
  });

  return (
    <button
      className={twMerge(
        "flex max-h-[60px] w-full max-w-full items-center justify-center gap-1 bg-[#DBE8F68F] p-1 transition-colors hover:bg-[#BBD0E9]",
        currentVerseNumber === verse.overallVerseNumber &&
          settings.mode === PresenterMode.Playlist &&
          "bg-[#BBD0E9]"
      )}
      onClick={() => {
        setCurrentVerseNumber(verse.overallVerseNumber);
        updateSettings({ mode: PresenterMode.Playlist });
      }}
    >
      {verseData.isLoading ? (
        <LoadingIcon className="h-4 w-4" />
      ) : (
        <div className={twMerge("flex w-full justify-between")}>
          <div className="flex w-4/5 flex-col p-1">
            <p className="truncate text-sm">
              {verseData.data?.verse[0]?.ARABIC}
            </p>
            <p className="truncate text-sm">
              {verseData.data?.verse[0]?.ENGLISH}
            </p>
          </div>
          <div className="flex w-1/5 flex-col items-center">
            <p className="text-sm">
              ({verseData.data?.verse[0]?.surahNumber}:
              {verseData.data?.verse[0]?.verseNumber})
            </p>
            <p className="truncate text-xs">
              {
                getSurahData(verseData.data?.verse[0]?.surahNumber)
                  ?.surahNameEnglish
              }
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // If the verse is currently showing, move to the next one
                if (currentVerseNumber === verse.overallVerseNumber) {
                  setCurrentVerseNumber(
                    playlist[index + 1]?.overallVerseNumber || 1
                  );
                }
                removeFromPlaylist(index);
              }}
            >
              <XCircleIcon className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </button>
  );
};
