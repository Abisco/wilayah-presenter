import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import React from "react";
import { twMerge } from "tailwind-merge";
import { useSettings } from "../../hooks/useSettings";
import { Combobox } from "../Combobox/Combobox";
import { OptionsBox } from "../OptionsBox/OptionsBox";

interface SettingsOptionsProps {
  expandable?: boolean;
}

export const SettingsOptions = ({
  expandable = false,
}: SettingsOptionsProps) => {
  const { settings, updateSettings } = useSettings();
  const {
    showArabic,
    showTranslation,
    translationFontColor,
    translationFontSize,
    arabicFontSize,
    layout,
    backgroundColor,
  } = settings;
  const fontSizeOptions = Array(20)
    .fill(0)
    .map((_, i) => (i + 7) * 2);

  return (
    <OptionsBox
      icon={<Cog6ToothIcon />}
      name="Settings"
      expandable={expandable}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between border-b border-[#BFBFBF]">
            <p className="text-base font-bold">Arabic</p>
            <input
              type="checkbox"
              checked={showArabic}
              onChange={() => updateSettings({ showArabic: !showArabic })}
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <p className="text-sm">Font Size</p>
            <Combobox
              items={fontSizeOptions.map((size) => ({
                label: `${size}px`,
                value: `${size}`,
              }))}
              selected={arabicFontSize.toString()}
              onSelect={(selectedFont) =>
                updateSettings({ arabicFontSize: parseInt(selectedFont.value) })
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between border-b border-[#BFBFBF]">
            <p className="text-base font-bold">English</p>
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={() =>
                updateSettings({ showTranslation: !showTranslation })
              }
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <p className="text-sm">Font Size</p>
            <Combobox
              items={fontSizeOptions.map((size) => ({
                label: `${size}px`,
                value: `${size}`,
              }))}
              selected={translationFontSize.toString()}
              onSelect={(selectedFont) =>
                updateSettings({
                  translationFontSize: parseInt(selectedFont.value),
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between border-b border-[#BFBFBF]">
            <p className="text-base font-bold">Layout</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSettings({ layout: "Full" })}
              className={twMerge(
                "relative flex h-12 w-20 flex-col items-center justify-center bg-[#AFACAC] hover:border hover:border-green-400",
                layout === "Full" && "border border-green-400"
              )}
            >
              <div
                className="absolute flex h-full w-full items-center justify-center"
                style={{ backgroundColor }}
              >
                <p className="bold" style={{ color: translationFontColor }}>
                  Full
                </p>
              </div>
            </button>
            <button
              onClick={() => updateSettings({ layout: "Third" })}
              className={twMerge(
                "relative flex h-12 w-20 flex-col items-center justify-center bg-[#AFACAC] hover:border hover:border-green-400",
                layout === "Third" && "border border-green-400"
              )}
            >
              <div
                className="absolute bottom-0 flex h-1/3 w-full items-center justify-center"
                style={{ backgroundColor }}
              >
                <p className="bold" style={{ color: translationFontColor }}>
                  Third
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </OptionsBox>
  );
};
