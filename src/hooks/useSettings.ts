import { useCallback, useContext } from "react";
import { useBroadcastHandlerHook } from "./broadcastHandlerHook";
import { HookContext } from "./hooksProvider";

export type LayoutOptions = "Full" | "Third";

export interface SettingsType {
  backgroundColor: string;
  showArabic: boolean;
  arabicFontSize: number;
  arabicFontColor: string;
  arabicSource: string;
  showTranslation: boolean;
  translationLanguage: "ENGLISH" | "URDU" | "FRENCH";
  translationFontSize: number;
  translationFontColor: string;
  translationSource: string;
  layout: LayoutOptions;
}

export const useSettings = () => {
  const { settings, setSettings } = useContext(HookContext);
  const { sendBroadcast } = useBroadcastHandlerHook();

  const updateSettings = useCallback(
    (newSettings: Partial<SettingsType>, updateChannels = true) => {
      setSettings((prev) => {
        if (!prev) {
          return newSettings as SettingsType;
        }

        if (updateChannels)
          sendBroadcast("updateSettings", { ...prev, ...newSettings });

        return {
          ...prev,
          ...newSettings,
        };
      });
    },
    [sendBroadcast, setSettings]
  );

  const changeSize = (
    type: "arabic" | "translation",
    sizeToChangeBy: number
  ) => {
    updateSettings({
      [`${type}FontSize`]: settings[`${type}FontSize`] + sizeToChangeBy,
    });
  };

  const getSources = useCallback(() => {
    if (!settings) {
      return [];
    }
    const sources = [];
    if (settings.showArabic) {
      sources.push(settings.arabicSource);
    }
    if (settings.showTranslation) {
      sources.push(settings.translationSource);
    }
    return sources;
  }, [settings]);

  return {
    settings,
    updateSettings,
    changeSize,
    getSources,
  };
};
