import type { OrganizedVerseType } from "../../hooks/hooksProvider";
import { useSettings } from "../../hooks/useSettings";

interface VersePreviewBoxProps {
  verse?: OrganizedVerseType;
}

export const VersePreviewBox = ({ verse }: VersePreviewBoxProps) => {
  const { settings } = useSettings();

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#313549] p-1 py-2">
      {verse && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {settings.showArabic && (
            <p className="max-w-full truncate text-[10px] text-white">
              {verse.ARABIC}
            </p>
          )}
          {settings.showTranslation && (
            <p className="max-w-full truncate text-[10px] text-white">
              {verse.ENGLISH}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
