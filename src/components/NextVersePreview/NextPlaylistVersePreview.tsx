import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { usePlaylist } from "../../hooks/usePlaylist";
import { useSettings } from "../../hooks/useSettings";
import { useVerseData } from "../../hooks/useVerseData";
import { api } from "../../utils/api";
import { VersePreviewBox } from "../VersePreviewBox/VersePreviewBox";

export const NextPlaylistVersePreview = () => {
  const { nextVerseInPlaylist } = usePlaylist();
  const { setCurrentVerseNumber } = useVerseData();
  const { getSources } = useSettings();

  const verseData = api.verses.getVerseByOverallVerseNumber.useQuery({
    overallVerseNumber: nextVerseInPlaylist() || 0,
    sources: getSources(),
    numVersesBefore: 0,
    numVersesAfter: 0,
  });

  const nextVerse = verseData.data?.verse[0];

  return (
    <div className="flex w-[28vw] max-w-[28vw] items-center gap-8">
      {nextVerse && (
        <>
          <div className="w-full max-w-[80%]">
            <VersePreviewBox verse={nextVerse} />
          </div>
          <button
            onClick={() => setCurrentVerseNumber(nextVerse?.overallVerseNumber)}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-black">Next</p>
              <p className="font-italic text-[10px] text-black">
                {nextVerse?.surahNumber}:{nextVerse?.verseNumber}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#313549]">
              <ArrowRightIcon className="h-full w-full text-white" />
            </div>
          </button>
        </>
      )}
    </div>
  );
};
