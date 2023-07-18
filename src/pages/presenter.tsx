import { type NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { HotkeysProvider } from "react-hotkeys-hook";
import { NextDefaultVersePreview } from "../components/NextVersePreview/NextDefaultVersePreview";
import { NextPlaylistVersePreview } from "../components/NextVersePreview/NextPlaylistVersePreview";
import { PlaylistOptions } from "../components/PlaylistOptions/PlaylistOptions";
import { Presentation } from "../components/Presentation/Presentation";
import { PreviousDefaultVersePreview } from "../components/PreviousVersePreview/PreviousDefaultVersePreview";
import { PreviousPlaylistVersePreview } from "../components/PreviousVersePreview/PreviousPlaylistVersePreview";
import { SettingsOptions } from "../components/SettingsOptions/SettingsOptions";
import { ShortcutOptions } from "../components/ShortcutOptions/ShortcutOptions";
import { Toolbar } from "../components/Toolbar/Toolbar";
import { VerseOptions } from "../components/VerseOptions/VerseOptions";
import { useInitBroadcasts } from "../hooks/broadcastHandlerHook";
import { PresenterMode } from "../hooks/hooksProvider";
import { useInitializeHotkeys } from "../hooks/useHotkeyHandler";
import { useQuranIndex } from "../hooks/useQuranIndex";
import { useSettings } from "../hooks/useSettings";
import { useVerseData } from "../hooks/useVerseData";

const Presenter: NextPage = () => {
  const { currentVerse, verseData } = useVerseData();
  const { getSurahData } = useQuranIndex();
  const { settings } = useSettings();

  useInitializeHotkeys();
  const { initiateConnection, setupBroadcasts } = useInitBroadcasts();

  useEffect(() => {
    initiateConnection();
    setupBroadcasts();
  }, []);

  return (
    <>
      <Head>
        <title>Wilayah Presenter - Presenter View</title>
        <meta name="description" content="Present The Quran Easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HotkeysProvider initiallyActiveScopes={["general"]}>
        <main className="max-w-screen flex h-screen max-h-screen w-screen flex-col overflow-hidden bg-white">
          <Toolbar />
          <div className="flex h-[calc(100vh-80px)] gap-10 px-4 py-2">
            <div className="flex h-full w-4/12 max-w-[33.333%] flex-col gap-3 overflow-y-auto">
              <VerseOptions />
              <PlaylistOptions expandable />
              <SettingsOptions expandable />
              <ShortcutOptions expandable />
            </div>
            <div className="flex h-full max-h-full w-8/12 min-w-[66.666%] flex-col items-center justify-between">
              <div className="relative flex h-[60vh] w-full items-end border border-gray-300">
                <Presentation
                  isLoading={verseData.isLoading}
                  currentVerse={currentVerse}
                  surahData={getSurahData(currentVerse?.surahNumber)}
                  textScale={0.6}
                />
              </div>
              <div className="flex items-center justify-between">
                {settings.mode === PresenterMode.Default && (
                  <>
                    <PreviousDefaultVersePreview />
                    <NextDefaultVersePreview />
                  </>
                )}
                {settings.mode === PresenterMode.Playlist && (
                  <>
                    <PreviousPlaylistVersePreview />
                    <NextPlaylistVersePreview />
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </HotkeysProvider>
    </>
  );
};

export default Presenter;
