import { XCircleIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";
import type { OrganizedVerseType } from "../../hooks/hooksProvider";
import type { SurahDataType } from "../../hooks/useQuranIndex";
import { useSettings } from "../../hooks/useSettings";
import { LoadingIcon } from "../LoadingIcon/LoadingIcon";
import { Tooltip } from "../Tooltip/Tooltip";

interface PresentationProps {
  isLoading?: boolean;
  currentVerse?: OrganizedVerseType;
  surahData: SurahDataType;
}

export const Presentation = ({
  isLoading = false,
  currentVerse,
  surahData,
}: PresentationProps) => {
  const { settings, updateSettings } = useSettings();
  const {
    showArabic,
    arabicFontSize,
    showTranslation,
    backgroundColor,
    translationFontSize,
    translationLanguage,
  } = settings;

  return (
    <div
      className={twMerge(
        "relative flex h-full w-full flex-col",
        settings.layout === "Third"
          ? "h-[33%] min-h-[33%] overflow-y-auto overflow-x-hidden"
          : "absolute top-0 h-full"
      )}
      style={{ backgroundColor }}
    >
      {settings.layout === "Full" && (
        <Tooltip text="Close full screen">
          <button
            onClick={() => {
              updateSettings({
                layout: "Third",
              });
            }}
            className="absolute top-2 right-2 text-white hover:text-gray-300"
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        </Tooltip>
      )}
      {!currentVerse && isLoading ? (
        <div className="absolute top-1/2 left-1/2">
          <LoadingIcon />
        </div>
      ) : (
        <>
          <div className="flex flex-grow flex-col items-center justify-center gap-2 p-1 text-white">
            {showArabic && (
              <h3 className="text-center" style={{ fontSize: arabicFontSize }}>
                <span>{currentVerse?.ARABIC} </span>
                <span>
                  ({currentVerse?.verseNumber.toLocaleString("ar-EG")})
                </span>
              </h3>
            )}
            {showTranslation && (
              <h3
                className="flex text-center"
                style={{ fontSize: translationFontSize }}
              >
                {currentVerse?.[translationLanguage]} (
                {currentVerse?.surahNumber}:{currentVerse?.verseNumber})
              </h3>
            )}
          </div>
          <p className="absolute bottom-4 left-5 text-lg text-white">
            {surahData?.surahNameArabic}
          </p>
          <p className="absolute bottom-4 right-5 text-lg text-white">
            {surahData?.surahNameEnglish}
          </p>
        </>
      )}
    </div>
  );
};
