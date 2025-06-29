import { HexColorPicker } from "react-colorful";
import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";

type ColourPickerPopoverProps = {
  colour: string;
  onChange: (colour: string) => void;
  trigger: React.ReactNode;
  onReset?: () => void;
};

const PRESET_COLOURS = [
  "#000000",
  "#FFFFFF",
  "#00B140",
  "#C41E3A", // Red (representing sacrifice and martyrdom in Shia Islam)
  "#8C8C8C", // Grey (symbolizing wisdom and balance)
  "#006400", // Dark green (traditional Islamic color)
  "#90EE90", // Light green (paradise, nature)
  "#0066CC", // Blue (divine protection, heaven)
  "#800080", // Purple (spirituality)
  "#FFD700", // Gold (divine light)
  "#8B4513", // Brown (earth, humility)
];

export const ColourPickerPopover = ({
  colour,
  onChange,
  trigger,
  onReset,
}: ColourPickerPopoverProps) => {
  return (
    <Popover className="relative">
      <Float
        placement="right"
        offset={4}
        as="div"
        className="relative"
        portal
        adaptiveWidth
      >
        <Popover.Button as="div" className="cursor-pointer">
          {trigger}
        </Popover.Button>

        <Popover.Panel className="relative z-10 w-[200px] border bg-gray-300">
          <div className="flex flex-col gap-2 p-2">
            <button
              className="rounded border border-gray-400 bg-gray-100 px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
              onClick={onReset}
            >
              Reset Color
            </button>
          </div>
          <HexColorPicker
            color={colour}
            onChange={(color) => onChange(color)}
          />
          <div className="-top-2 flex w-[200px] flex-wrap items-center gap-1 rounded-b-md  border bg-gray-300 p-2">
            {PRESET_COLOURS.map((presetColour) => (
              <button
                key={presetColour}
                className="size-4 rounded border border-gray-600 transition-colors hover:scale-110"
                style={{ backgroundColor: presetColour }}
                onClick={() => onChange(presetColour)}
                title={`Select color ${presetColour}`}
                aria-label={`Select color ${presetColour}`}
              />
            ))}
          </div>
        </Popover.Panel>
      </Float>
    </Popover>
  );
};
