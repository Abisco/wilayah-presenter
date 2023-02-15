import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Tooltip } from "../Tooltip/Tooltip";
import { VerseSearch } from "../VerseSearch/VerseSearch";

/**
 * Primary UI component for user interaction
 */
export const Toolbar = () => {
  return (
    <div className="relative flex h-auto w-full items-center bg-[#313549] py-5 px-5">
      <h1 className="mr-auto text-lg text-white underline">
        Wilayah Presenter
      </h1>
      <div className="absolute left-1/2 -ml-[25%] w-1/2">
        <VerseSearch />
      </div>
      <Tooltip text="Open presenter view">
        <button
          onClick={() => window.open(`/presenter`, "_blank")}
          className="ml-auto mr-2 rounded-full bg-[#5B5454]/40 p-2 hover:bg-[#5B5454]/80"
        >
          <ComputerDesktopIcon className="h-6 w-6 text-white" />
        </button>
      </Tooltip>
    </div>
  );
};
