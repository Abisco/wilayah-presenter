import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useSettings } from "../../hooks/useSettings";
import { KeyboardKey } from "../KeyboardKey/KeyboardKey";
import { OptionsBox } from "../OptionsBox/OptionsBox";

interface ShortcutOptionsProps {
  expandable?: boolean;
}

export const ShortcutOptions = ({
  expandable = false,
}: ShortcutOptionsProps) => {
  const { changeSize, updateSettings, settings } = useSettings();

  return (
    <OptionsBox
      icon={<DocumentDuplicateIcon />}
      name="Keyboard Shortcuts"
      expandable={expandable}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between border-b border-[#BFBFBF]">
            <p className="text-left text-base font-bold">General</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex w-full items-center gap-3">
              <p className="w-1/2 text-left text-sm">Pull up verse</p>
              <div className="flex items-center justify-start gap-2">
                <KeyboardKey keyName="114" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="Enter" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="1" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="Enter" />
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({ showArabic: !settings.showArabic })
              }
              className="flex w-full items-center gap-3 hover:bg-gray-200"
            >
              <p className="w-1/2 text-left text-sm">Toggle Arabic</p>
              <div className="flex w-1/2 items-center justify-start gap-2">
                <KeyboardKey keyName="Shift" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="Q" />
              </div>
            </button>
            <button
              onClick={() =>
                updateSettings({ showTranslation: !settings.showTranslation })
              }
              className="flex w-full items-center gap-3 hover:bg-gray-200"
            >
              <p className="w-1/2 text-left text-sm">Toggle English</p>
              <div className="flex w-1/2 items-center justify-start gap-2">
                <KeyboardKey keyName="Shift" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="E" />
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between border-b border-[#BFBFBF]">
            <p className="text-base font-bold">Font Sizes</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => changeSize("arabic", 2)}
              className="flex w-full items-center gap-3 hover:bg-gray-200"
            >
              <p className="w-1/2 text-left text-sm">Increase Arabic Size</p>
              <div className="flex w-1/2 items-center justify-start gap-2">
                <KeyboardKey keyName="Alt" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="Q" />
              </div>
            </button>
            <button
              onClick={() => changeSize("arabic", -2)}
              className="flex w-full items-center gap-3 hover:bg-gray-200"
            >
              <p className="w-1/2 text-left text-sm">Decrease Arabic Size</p>
              <div className="flex w-1/2 items-center justify-start gap-2">
                <KeyboardKey keyName="Alt" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="W" />
              </div>
            </button>
            <button
              onClick={() => changeSize("translation", 2)}
              className="flex w-full items-center gap-3 hover:bg-gray-200"
            >
              <p className="w-1/2 text-left text-sm">Increase English Size</p>
              <div className="flex w-1/2 items-center justify-start gap-2">
                <KeyboardKey keyName="Alt" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="E" />
              </div>
            </button>
            <button
              onClick={() => changeSize("translation", -2)}
              className="flex w-full items-center gap-3 hover:bg-gray-200"
            >
              <p className="w-1/2 text-left text-sm">Decrease English Size</p>
              <div className="flex w-1/2 items-center justify-start gap-2">
                <KeyboardKey keyName="Alt" />
                <span className="text-lg font-bold text-black">+</span>
                <KeyboardKey keyName="R" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </OptionsBox>
  );
};
