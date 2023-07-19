import { useCallback, useContext } from "react";
import type { PlaylistType } from "./hooksProvider";
import { HookContext } from "./hooksProvider";
import { BroadcastChannel } from "broadcast-channel";
import { useVerseData } from "./useVerseData";
import { usePlaylist } from "./usePlaylist";
import { useSettings } from "./useSettings";

type AcceptableBroadcastData =
  | "verseNumberChange"
  | "updatePlaylist"
  | "updateSettings";

interface WilayahBroadcastMessage {
  message: AcceptableBroadcastData;
  senderId: string;
  // Any other data that needs to be sent
  [key: string]: unknown;
}

const broadcastChannel = new BroadcastChannel("wilayah-broadcast-channel");

export const useBroadcastHandlerHook = () => {
  const { broadcasterWindowId } = useContext(HookContext);

  const instantiateBroadcastHandler = useCallback(
    (
      callback: (
        message: AcceptableBroadcastData,
        messageData: {
          [key: string]: unknown;
        }
      ) => void
    ) => {
      broadcastChannel.onmessage = (message: WilayahBroadcastMessage) => {
        if (message?.senderId === broadcasterWindowId) return;

        console.log("Received broadcast message: ", message);
        callback(message?.message, message);
      };
    },
    [broadcasterWindowId]
  );

  const sendBroadcast = useCallback(
    (
      message: AcceptableBroadcastData,
      messageData: { [key: string]: unknown } = {}
    ) => {
      console.log(
        "Sending broadcast message: ",
        message,
        broadcasterWindowId,
        messageData
      );

      void broadcastChannel.postMessage({
        message,
        senderId: broadcasterWindowId,
        ...messageData,
      } as WilayahBroadcastMessage);
    },
    [broadcasterWindowId]
  );

  return {
    instantiateBroadcastHandler,
    sendBroadcast,
  };
};

export const useInitBroadcasts = () => {
  const { instantiateBroadcastHandler } = useBroadcastHandlerHook();
  const { setCurrentVerseNumber } = useVerseData();
  const { updatePlaylist } = usePlaylist();
  const { updateSettings, settings } = useSettings();

  const setupBroadcasts = useCallback(() => {
    instantiateBroadcastHandler((message, messageData) => {
      switch (message) {
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

        case "updatePlaylist": {
          updatePlaylist(messageData?.playlist as PlaylistType, false);
          break;
        }
      }
    });
  }, [
    instantiateBroadcastHandler,
    setCurrentVerseNumber,
    updatePlaylist,
    updateSettings,
  ]);

  return {
    setupBroadcasts,
  };
};
