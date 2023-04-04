import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { usePlaylist } from "../../hooks/usePlaylist";
import { useSettings } from "../../hooks/useSettings";
import { useVerseData } from "../../hooks/useVerseData";
import { api } from "../../utils/api";
import { VersePreviewBox } from "../VersePreviewBox/VersePreviewBox";

export const PreviousPlaylistVersePreview = () => {
  const { previousVerseInPlaylist } = usePlaylist();
  const { setCurrentVerseNumber } = useVerseData();
  const { getSources } = useSettings();

  const verseData = api.verses.getVerseByOverallVerseNumber.useQuery({
    overallVerseNumber: previousVerseInPlaylist() || 0,
    sources: getSources(),
    numVersesBefore: 0,
    numVersesAfter: 0,
  });

  const previousVerse = verseData.data?.verse[0];

  return (
    <div className="flex w-[28vw] max-w-[28vw] items-center gap-8">
      {previousVerse && (
        <>
          <button
            onClick={() =>
              setCurrentVerseNumber(previousVerse?.overallVerseNumber)
            }
            className="flex flex-col items-center gap-1.5"
          >
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-black">Previous</p>
              <p className="font-italic text-[10px] text-black">
                {previousVerse?.surahNumber}:{previousVerse?.verseNumber}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#313549]">
              <ArrowLeftIcon className="h-full w-full text-white" />
            </div>
          </button>
          <div className="w-full max-w-[80%]">
            <VersePreviewBox verse={previousVerse} />
          </div>
        </>
      )}
    </div>
  );
};
