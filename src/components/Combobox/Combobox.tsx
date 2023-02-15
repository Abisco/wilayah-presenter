import { Fragment, useState } from "react";
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";
import { Float } from "@headlessui-float/react";
import { LoadingIcon } from "../LoadingIcon/LoadingIcon";

type Item = {
  label: string;
  value: string;
  extraLabel?: string;
};

interface ComboboxProps {
  items: Array<Item>;
  selected?: string;
  onSelect: (item: Item) => void;
  placeholder?: string;
  inputClassName?: string;
  listClassName?: string;
  onQueryChange?: (query: string) => void;
  onSubmit?: () => void;
  onKeydown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
}

export const Combobox = ({
  items,
  onSelect,
  selected,
  placeholder = "",
  inputClassName = "",
  listClassName = "",
  onQueryChange,
  onSubmit,
  onKeydown,
  onFocus,
  inputRef,
  isLoading = false,
}: ComboboxProps) => {
  const [query, setQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <HeadlessCombobox
      value={items.find((item) => item.value == selected)}
      onChange={onSelect}
    >
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
            <HeadlessCombobox.Input
              onSubmit={onSubmit}
              placeholder={placeholder}
              onKeyDown={onKeydown}
              className={twMerge(
                "w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus-visible:outline-blue-200",
                inputClassName
              )}
              onFocus={onFocus}
              displayValue={(item: Item) => item.label}
              onChange={(event) => {
                event.stopPropagation();
                setQuery(event.target.value);
                onQueryChange?.(event.target.value);
              }}
              ref={inputRef}
            />
            <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </HeadlessCombobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {
              setQuery("");
              onQueryChange?.("");
            }}
          >
            <HeadlessCombobox.Options
              className={twMerge(
                "max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                listClassName
              )}
            >
              {isLoading && (
                <div className="w-full py-4">
                  <LoadingIcon className="flex h-5 w-5 items-center" />
                </div>
              )}

              {!isLoading && (
                <>
                  {filteredItems.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <HeadlessCombobox.Option
                        key={item.value}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-2 ${
                            active ? "bg-teal-600 text-white" : "text-gray-900"
                          }`
                        }
                        value={item}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {item.label}
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
    </HeadlessCombobox>
  );
};
