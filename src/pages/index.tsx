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
import { usePlaylist } from "../hooks/usePlaylist";
import { useQuranIndex } from "../hooks/useQuranIndex";
import { useSettings } from "../hooks/useSettings";
import { useVerseData } from "../hooks/useVerseData";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { currentVerse, verseData } = useVerseData();
  const { getSurahData } = useQuranIndex();
  const { settings } = useSettings();

  useInitializeHotkeys();
  const { initiateConnection, setupBroadcasts } = useInitBroadcasts();
  const router = useRouter();

  useEffect(() => {
    initiateConnection();
    setupBroadcasts();
  }, []);

  return (
    <>
      <Head>
        <title>Wilayah Presenter</title>
        <meta name="description" content="Present The Quran Easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HotkeysProvider initiallyActiveScopes={["general"]}>
        <main className="max-w-screen flex h-screen max-h-screen w-screen flex-col overflow-x-hidden overflow-y-hidden bg-white">
          <Toolbar />
          <div className="flex max-h-[60%] flex-grow items-center justify-between gap-3 px-4 py-1">
            <div className="flex h-full max-w-[30%] flex-col items-center justify-between py-2">
              <SettingsOptions expandable={false} />
              {settings.mode === PresenterMode.Default && (
                <PreviousDefaultVersePreview />
              )}
              {settings.mode === PresenterMode.Playlist && (
                <PreviousPlaylistVersePreview />
              )}
            </div>
            <div className="flex max-h-full max-w-[30%] flex-col items-center justify-around gap-1">
              <VerseOptions />
              <PlaylistOptions />
            </div>
            <div className="flex h-full max-w-[30%] flex-col items-center justify-between py-2">
              <ShortcutOptions expandable={false} />
              {settings.mode === PresenterMode.Default && (
                <NextDefaultVersePreview />
              )}
              {settings.mode === PresenterMode.Playlist && (
                <NextPlaylistVersePreview />
              )}
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
