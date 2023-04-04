import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useVerseData } from "../../hooks/useVerseData";
import { VersePreviewBox } from "../VersePreviewBox/VersePreviewBox";

export const NextDefaultVersePreview = () => {
  const { nextVerse, changeVerseLocally } = useVerseData();

  return (
    <div className="flex w-[28vw] max-w-[28vw] items-center gap-8">
      {nextVerse && (
        <>
          <div className="w-full max-w-[80%]">
            <VersePreviewBox verse={nextVerse} />
          </div>
          <button
            onClick={() => changeVerseLocally(1)}
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
