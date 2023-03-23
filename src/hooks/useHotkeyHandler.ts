import { useHotkeys } from "react-hotkeys-hook";
import { PresenterMode } from "./hooksProvider";
import { usePlaylist } from "./usePlaylist";
import { useSettings } from "./useSettings";
import { useVerseData } from "./useVerseData";

export const useInitializeHotkeys = () => {
  const { changeSize, updateSettings, settings } = useSettings();
  const { changeVerseLocally, setCurrentVerseNumber } = useVerseData();

  const { previousVerseInPlaylist, nextVerseInPlaylist } = usePlaylist();

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
  useHotkeys(
    "right",
    () => {
      if (settings.mode === PresenterMode.Default) {
        changeVerseLocally(1);
      } else if (settings.mode === PresenterMode.Playlist) {
        const nextVerse = nextVerseInPlaylist();
        if (nextVerse) {
          setCurrentVerseNumber(nextVerse);
        }
      }
    },
    { scopes: "general" },
    [
      changeVerseLocally,
      setCurrentVerseNumber,
      nextVerseInPlaylist,
      settings.mode,
    ]
  );

  useHotkeys(
    "left",
    () => {
      if (settings.mode === PresenterMode.Default) {
        changeVerseLocally(-1);
      } else if (settings.mode === PresenterMode.Playlist) {
        const prevVerse = previousVerseInPlaylist();
        if (prevVerse) {
          setCurrentVerseNumber(prevVerse);
        }
      }
    },
    { scopes: "general" },
    [
      changeVerseLocally,
      setCurrentVerseNumber,
      previousVerseInPlaylist,
      settings.mode,
    ]
  );

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
};
