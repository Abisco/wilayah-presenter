import { useCallback, useContext } from "react";
import { useBroadcastHandlerHook } from "./broadcastHandlerHook";
import type { PlaylistType, PlaylistVerseType } from "./hooksProvider";
import { PresenterMode } from "./hooksProvider";
import { HookContext } from "./hooksProvider";
import { useSettings } from "./useSettings";
import { useVerseData } from "./useVerseData";

export type LayoutOptions = "Full" | "Third";

export const usePlaylist = () => {
  const { playlist, setPlaylist } = useContext(HookContext);
  const { currentVerseNumber } = useVerseData();
  const { settings } = useSettings();
  const { sendBroadcast } = useBroadcastHandlerHook();

  const updatePlaylist = useCallback(
    (newPlaylist: PlaylistType, updateChannels = true) => {
      setPlaylist(() => {
        if (updateChannels)
          sendBroadcast("updatePlaylist", { playlist: newPlaylist });

        return [...newPlaylist];
      });
    },
    [sendBroadcast, setPlaylist]
  );

  const addToPlaylist = useCallback(
    (newVerse: PlaylistVerseType) => {
      setPlaylist((prev) => {
        sendBroadcast("updatePlaylist", { playlist: [...prev, newVerse] });

        return [...prev, { ...newVerse }];
      });
    },
    [sendBroadcast, setPlaylist]
  );

  // Given an index of a verse in the playlist, remove it from the playlist
  const removeFromPlaylist = (playlistIndex: number) => {
    setPlaylist((prev) => {
      prev.splice(playlistIndex, 1);

      sendBroadcast("updatePlaylist", { playlist: [...prev] });

      return [...prev];
    });
  };

  const clearPlaylist = useCallback(() => {
    setPlaylist(() => {
      sendBroadcast("updatePlaylist", { playlist: [] });

      return [];
    });
  }, [sendBroadcast, setPlaylist]);

  const currentlyPresentInPlaylist = useCallback(() => {
    if (settings.mode === PresenterMode.Default) return 0;

    return playlist.find(
      (verse) => verse.overallVerseNumber === currentVerseNumber
    )?.overallVerseNumber;
  }, [currentVerseNumber, playlist, settings.mode]);

  const nextVerseInPlaylist = useCallback(() => {
    if (settings.mode === PresenterMode.Default) return false;
    const currentlyPresentVerseIndex = playlist.findIndex(
      (verse) => verse.overallVerseNumber === currentVerseNumber
    );

    if (currentlyPresentVerseIndex === -1) return false;

    if (currentlyPresentVerseIndex === playlist.length - 1) return false;
    return playlist[currentlyPresentVerseIndex + 1]?.overallVerseNumber;
  }, [currentVerseNumber, playlist, settings.mode]);

  const previousVerseInPlaylist = useCallback(() => {
    if (settings.mode === PresenterMode.Default) return false;
    const currentlyPresentVerseIndex = playlist.findIndex(
      (verse) => verse.overallVerseNumber === currentVerseNumber
    );

    if (currentlyPresentVerseIndex === -1) return false;

    if (currentlyPresentVerseIndex === 0) return false;
    return playlist[currentlyPresentVerseIndex - 1]?.overallVerseNumber;
  }, [currentVerseNumber, playlist, settings.mode]);

  return {
    playlist,
    updatePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    currentlyPresentInPlaylist,
    nextVerseInPlaylist,
    previousVerseInPlaylist,
  };
};
