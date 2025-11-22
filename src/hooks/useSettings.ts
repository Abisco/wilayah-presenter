import { devLogger } from "./../utils/devUtils";
import { useCallback, useContext } from "react";
import { useBroadcastHandlerHook } from "./broadcastHandlerHook";
import type { PresenterMode } from "./hooksProvider";
import { HookContext, DefaultSettings } from "./hooksProvider";
import { useLocalStorage } from "./useLocalStorage";

export type LayoutOptions = "Full" | "Third" | "Third-Left" | "Presenter-Left";

export interface SettingsType {
  backgroundColor: string;
  settingsAreaBackgroundColor: string;
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
  mode: PresenterMode;
}

export interface SettingsTemplate {
  id: string;
  name: string;
  settings: SettingsType;
  createdAt: number;
}

export const useSettings = () => {
  const { settings, setSettings } = useContext(HookContext);
  const { sendBroadcast } = useBroadcastHandlerHook();
  const { getItem: getTemplatesFromStorage, setItem: setTemplatesToStorage } =
    useLocalStorage<SettingsTemplate[]>("settingsTemplates");
  const { setItem: setSettingsToStorage } =
    useLocalStorage<SettingsType>("settings");

  const updateSettings = useCallback(
    (newSettings: Partial<SettingsType>, updateChannels = true) => {
      setSettings((prev) => {
        if (!prev) {
          return newSettings as SettingsType;
        }

        if (updateChannels) {
          const updatedSettings = { ...prev, ...newSettings };
          sendBroadcast("updateSettings", updatedSettings);
          devLogger("Local Storage: Set", updatedSettings);
          setSettingsToStorage(updatedSettings);
        }

        return {
          ...prev,
          ...newSettings,
        };
      });
    },
    [sendBroadcast, setSettings, setSettingsToStorage]
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
    const sources = [];
    sources.push(settings.arabicSource);
    sources.push(settings.translationSource);
    return sources;
  }, [settings.arabicSource, settings.translationSource]);

  const getTemplates = useCallback((): SettingsTemplate[] => {
    const item = getTemplatesFromStorage();
    return item ?? [];
  }, [getTemplatesFromStorage]);

  const saveTemplate = useCallback(
    (name: string): SettingsTemplate => {
      const templates = getTemplates();
      const newTemplate: SettingsTemplate = {
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        settings: { ...settings },
        createdAt: Date.now(),
      };
      const updatedTemplates = [...templates, newTemplate];
      setTemplatesToStorage(updatedTemplates);
      devLogger("Local Storage: Save Template", newTemplate);
      return newTemplate;
    },
    [settings, getTemplates, setTemplatesToStorage]
  );

  const loadTemplate = useCallback(
    (templateId: string) => {
      const templates = getTemplates();
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        updateSettings(template.settings);
        devLogger("Local Storage: Load Template", template);
      }
    },
    [getTemplates, updateSettings]
  );

  const deleteTemplate = useCallback(
    (templateId: string) => {
      const templates = getTemplates();
      const updatedTemplates = templates.filter((t) => t.id !== templateId);
      setTemplatesToStorage(updatedTemplates);
      devLogger("Local Storage: Delete Template", templateId);
    },
    [getTemplates, setTemplatesToStorage]
  );

  const loadDefaultSettings = useCallback(() => {
    updateSettings(DefaultSettings);
    devLogger("Load Default Settings", DefaultSettings);
  }, [updateSettings]);

  return {
    settings,
    updateSettings,
    changeSize,
    getSources,
    getTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    loadDefaultSettings,
  };
};
