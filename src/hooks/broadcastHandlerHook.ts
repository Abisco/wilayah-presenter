import { useCallback, useContext } from "react";
import type { PlaylistType } from "./hooksProvider";
import { HookContext } from "./hooksProvider";
import { BroadcastChannel } from "broadcast-channel";
import { useVerseData } from "./useVerseData";
import { usePlaylist } from "./usePlaylist";
import type { SettingsType } from "./useSettings";
import { useSettings } from "./useSettings";

type AcceptableBroadcastData =
  | "verseNumberChange"
  | "updatePlaylist"
  | "updateSettings"
  | "initiateConnection"
  | "initiateConnectionResponse";

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
  const { instantiateBroadcastHandler, sendBroadcast } =
    useBroadcastHandlerHook();
  const { changeVerseLocally, setCurrentVerseNumber, currentVerseNumber } =
    useVerseData();
  const { playlist, updatePlaylist } = usePlaylist();
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

        case "initiateConnectionResponse": {
          updateSettings(messageData.settings as SettingsType, false);
          updatePlaylist(messageData.playlist as PlaylistType, false);
          setCurrentVerseNumber(
            messageData.currentVerseNumber as number,
            false
          );
          break;
        }

        case "initiateConnection": {
          sendBroadcast("initiateConnectionResponse", {
            settings,
            currentVerseNumber,
            playlist,
          });
          break;
        }
      }
    });
  }, [
    changeVerseLocally,
    currentVerseNumber,
    instantiateBroadcastHandler,
    playlist,
    sendBroadcast,
    setCurrentVerseNumber,
    settings,
    updatePlaylist,
    updateSettings,
  ]);

  const initiateConnection = useCallback(() => {
    sendBroadcast("initiateConnection");
  }, [sendBroadcast]);

  return {
    setupBroadcasts,
    initiateConnection,
  };
};
