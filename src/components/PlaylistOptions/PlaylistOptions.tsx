import { ListBulletIcon, XCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import { PlaylistItemType } from "../../hooks/hooksProvider";
import { usePlaylist } from "../../hooks/usePlaylist";
import { OptionsBox } from "../OptionsBox/OptionsBox";
import { PlaylistVerseItem } from "../PlaylistVerseItem/PlaylistVerseItem";

interface PlaylistOptionsProps {
  expandable?: boolean;
}

export const PlaylistOptions = ({
  expandable = false,
}: PlaylistOptionsProps) => {
  const { playlist, clearPlaylist } = usePlaylist();

  return (
    <OptionsBox
      icon={<ListBulletIcon />}
      actionIcon={
        playlist.length > 0 && <XCircleIcon className="text-red-500" />
      }
      actionTooltip="Clear playlist"
      action={() => {
        if (
          playlist.length > 0 &&
          window.confirm("Are you sure you want to clear the playlist?")
        ) {
          clearPlaylist();
        }
      }}
      name="Playlist"
      expandable={expandable}
    >
      <div className="flex flex-col gap-2">
        {playlist.length > 0 ? (
          playlist.map((item, index) => {
            if (item.type === PlaylistItemType.Verse) {
              return (
                <PlaylistVerseItem
                  verse={item}
                  index={index}
                  key={`${index}-${item.overallVerseNumber}`}
                />
              );
            }
          })
        ) : (
          <p className="text-center italic">No items in playlist</p>
        )}
      </div>
    </OptionsBox>
  );
};
