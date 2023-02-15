import { type NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { NextVersePreview } from "../components/NextVersePreview/NextVersePreview";
import { Presentation } from "../components/Presentation/Presentation";
import { PreviousVersePreview } from "../components/PreviousVersePreview/PreviousVersePreview";
import { SettingsOptions } from "../components/SettingsOptions/SettingsOptions";
import { ShortcutOptions } from "../components/ShortcutOptions/ShortcutOptions";
import { Toolbar } from "../components/Toolbar/Toolbar";
import { VerseOptions } from "../components/VerseOptions/VerseOptions";
import { useBroadcastHandlerHook } from "../hooks/broadcastHandlerHook";
import { useQuranIndex } from "../hooks/useQuranIndex";
import type { SettingsType } from "../hooks/useSettings";
import { useSettings } from "../hooks/useSettings";
import { useVerseData } from "../hooks/useVerseData";

const Presenter: NextPage = () => {
  const {
    currentVerse,
    verseData,
    changeVerseLocally,
    setCurrentVerseNumber,
    currentVerseNumber,
  } = useVerseData();
  const { getSurahData } = useQuranIndex();
  const { changeSize, updateSettings, settings } = useSettings();
  const { instantiateBroadcastHandler, sendBroadcast } =
    useBroadcastHandlerHook();

  // Change font size hotkeys
  useHotkeys("alt+q", () => changeSize("arabic", 2), { scopes: "general" }, [
    changeSize,
  ]);
  useHotkeys("alt+w", () => changeSize("arabic", -2), { scopes: "general" }, [
    changeSize,
  ]);
  useHotkeys(
    "alt+e",
    () => changeSize("translation", 2),
    { scopes: "general" },
    [changeSize]
  );
  useHotkeys(
    "alt+r",
    () => changeSize("translation", -2),
    { scopes: "general" },
    [changeSize]
  );

  // Verse navigation hotkeys
  useHotkeys("right", () => changeVerseLocally(1), { scopes: "general" }, [
    changeVerseLocally,
  ]);
  useHotkeys("left", () => changeVerseLocally(-1), { scopes: "general" }, [
    changeVerseLocally,
  ]);

  // Toggle hotkeys
  useHotkeys(
    "shift+q",
    () => updateSettings({ showArabic: !settings.showArabic }),
    { scopes: "general" },
    [settings.showArabic, updateSettings]
  );
  useHotkeys(
    "shift+e",
    () => updateSettings({ showTranslation: !settings.showTranslation }),
    { scopes: "general" },
    [settings.showTranslation, updateSettings]
  );

  useEffect(() => {
    instantiateBroadcastHandler((message, messageData) => {
      switch (message) {
        case "initiateConnectionResponse": {
          updateSettings(messageData.settings as SettingsType, false);
          setCurrentVerseNumber(
            messageData.currentVerseNumber as number,
            false
          );
        }
      }
    });
  }, [
    changeVerseLocally,
    currentVerseNumber,
    instantiateBroadcastHandler,
    sendBroadcast,
    setCurrentVerseNumber,
    settings,
    updateSettings,
  ]);

  useEffect(() => {
    sendBroadcast("initiateConnection");
  }, []);

  return (
    <>
      <Head>
        <title>Wilayah Presenter - Presenter View</title>
        <meta name="description" content="Present The Quran Easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HotkeysProvider initiallyActiveScopes={["general"]}>
        <main className="max-w-screen flex h-screen max-h-screen w-screen flex-col bg-white">
          <Toolbar />
          <div className="flex h-full max-h-full gap-10 px-4 py-2">
            <div className="flex h-full flex-col gap-3 overflow-y-auto">
              <VerseOptions />
              <SettingsOptions expandable />
              <ShortcutOptions expandable />
            </div>
            <div className="flex h-full max-h-full w-8/12 flex-col items-center justify-between">
              <div className="relative flex h-[60vh] w-full items-end border border-gray-300">
                <Presentation
                  isLoading={verseData.isLoading}
                  currentVerse={currentVerse}
                  surahData={getSurahData(currentVerse?.surahNumber)}
                />
              </div>
              <div className="flex items-center justify-between">
                <PreviousVersePreview />
                <NextVersePreview />
              </div>
            </div>
          </div>
        </main>
      </HotkeysProvider>
    </>
  );
};

export default Presenter;
