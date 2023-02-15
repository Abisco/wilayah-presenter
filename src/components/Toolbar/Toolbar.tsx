import React from "react";
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
      <button className="ml-auto"></button>
    </div>
  );
};
