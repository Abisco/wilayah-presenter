import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useVerseData } from "../../hooks/useVerseData";
import { VersePreviewBox } from "../VersePreviewBox/VersePreviewBox";

export const PreviousDefaultVersePreview = () => {
  const { previousVerse, changeVerseLocally } = useVerseData();

  return (
    <div className="flex w-[28vw] max-w-[28vw] items-center gap-8">
      {previousVerse && (
        <>
          <button
            onClick={() => changeVerseLocally(-1)}
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
