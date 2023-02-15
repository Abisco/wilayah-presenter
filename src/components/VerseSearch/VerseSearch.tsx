import { Fragment, useState } from "react";
import { api } from "../../utils/api";
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";
import { Float } from "@headlessui-float/react";
import { useVerseData } from "../../hooks/useVerseData";
import { LoadingIcon } from "../LoadingIcon/LoadingIcon";

export const VerseSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentVerseNumber, setCurrentVerseNumber } = useVerseData();

  const verseSearch = api.verses.searchText.useQuery({
    text: searchQuery,
  });

  return (
    <HeadlessCombobox
      value={(verseSearch.data?.verses || []).find(
        (verse) => verse.id == currentVerseNumber
      )}
      onChange={(verse) => {
        setCurrentVerseNumber(verse.overallVerseNumber);
      }}
    >
      {({}) => (
        <div className="relative mt-1">
          <Float
            placement="bottom"
            offset={4}
            as="div"
            className="relative"
            portal
            adaptiveWidth
          >
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#0F172A]" />
              </div>
              <HeadlessCombobox.Input
                placeholder={"What do you want to read?"}
                className={twMerge(
                  "w-full border-none py-2 pl-10 pr-3 text-sm leading-5 text-gray-900 focus:ring-0 focus-visible:outline-blue-200"
                )}
                displayValue={() => {
                  return "";
                }}
                onChange={(event) => {
                  event.stopPropagation();
                  setSearchQuery?.(event.target.value);
                }}
              />
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => {
                setSearchQuery?.("");
              }}
            >
              <HeadlessCombobox.Options
                className={twMerge(
                  "max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                )}
              >
                {verseSearch.isLoading && (
                  <div className="w-full py-4">
                    <LoadingIcon className="flex h-5 w-5 items-center" />
                  </div>
                )}

                {!verseSearch.isLoading && (
                  <>
                    {verseSearch?.data?.verses?.length === 0 &&
                    searchQuery !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      verseSearch?.data?.verses?.map((item) => (
                        <HeadlessCombobox.Option
                          key={item.overallVerseNumber}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 px-2 ${
                              active
                                ? "bg-teal-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={item}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                <span className="text-red-500">
                                  {item.surahNumber}:{item.verseNumber} -{" "}
                                </span>
                                {item.text}{" "}
                                <span className="text-sm italic">
                                  Source: {item.language} - {item.source}
                                </span>
                              </span>
                            </>
                          )}
                        </HeadlessCombobox.Option>
                      ))
                    )}
                  </>
                )}
              </HeadlessCombobox.Options>
            </Transition>
          </Float>
        </div>
      )}
    </HeadlessCombobox>
  );
};
