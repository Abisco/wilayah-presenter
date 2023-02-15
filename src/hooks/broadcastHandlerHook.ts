import { useCallback, useContext } from "react";
import { HookContext } from "./hooksProvider";

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

export const useBroadcastHandlerHook = () => {
  const { broadcastChannel, broadcasterWindowId } = useContext(HookContext);

  const instantiateBroadcastHandler = useCallback(
    (
      callback: (
        message: AcceptableBroadcastData,
        messageData: {
          [key: string]: unknown;
        }
      ) => void
    ) => {
      broadcastChannel.onmessage = (message) => {
        const messageData = message?.data as WilayahBroadcastMessage;
        if (messageData?.senderId === broadcasterWindowId) return;

        console.log("Received broadcast message: ", messageData);
        callback(messageData?.message, messageData);
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
