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
import { useSettings } from "../hooks/useSettings";
import { useVerseData } from "../hooks/useVerseData";

const Home: NextPage = () => {
  const {
    currentVerse,
    verseData,
    changeVerseLocally,
    currentVerseNumber,
    setCurrentVerseNumber,
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
        case "changeVerseLocally": {
          changeVerseLocally(messageData.verseNumberChange as 1 | -1);
          break;
        }

        case "verseNumberChange": {
          setCurrentVerseNumber(
            messageData.currentVerseNumber as number,
            false
          );
          break;
        }

        case "updateSettings": {
          updateSettings(messageData as unknown as typeof settings, false);
          break;
        }

        case "initiateConnection": {
          sendBroadcast("initiateConnectionResponse", {
            settings,
            currentVerseNumber,
          });
          break;
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

  return (
    <>
      <Head>
        <title>Wilayah Presenter</title>
        <meta name="description" content="Present The Quran Easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HotkeysProvider initiallyActiveScopes={["general"]}>
        <main className="flex h-screen w-screen flex-col bg-white">
          <Toolbar />
          <div className="flex flex-grow items-center justify-between gap-3 px-4">
            <div className="flex h-full flex-col items-center justify-between py-2">
              <SettingsOptions expandable={false} />
              <PreviousVersePreview />
            </div>
            <div className="flex flex-col items-center justify-around">
              <VerseOptions />
            </div>
            <div className="flex h-full flex-col items-center justify-between py-2">
              <ShortcutOptions expandable={false} />
              <NextVersePreview />
            </div>
          </div>

          <Presentation
            isLoading={verseData.isLoading}
            currentVerse={currentVerse}
            surahData={getSurahData(currentVerse?.surahNumber)}
          />
        </main>
      </HotkeysProvider>
    </>
  );
};

export default Home;
