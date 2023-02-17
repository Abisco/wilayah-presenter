import { useCallback, useContext } from "react";
import { HookContext } from "./hooksProvider";
import { BroadcastChannel } from "broadcast-channel";

type AcceptableBroadcastData =
  | "verseNumberChange"
  | "changeVerseLocally"
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
