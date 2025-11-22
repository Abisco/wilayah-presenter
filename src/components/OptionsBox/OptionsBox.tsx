import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import React from "react";
import { twMerge } from "tailwind-merge";
import type { OptionsTitleProps } from "../OptionsTitle/OptionsTitle";
import { OptionsTitle } from "../OptionsTitle/OptionsTitle";

interface OptionsBoxProps {
  expandable?: boolean;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

/**
 * Primary UI component for user interaction
 */
export const OptionsBox = ({
  children,
  expandable = false,
  className,
  name,
  icon,
  action,
  actionIcon,
  actionTooltip,
  headerAction,
}: OptionsBoxProps & OptionsTitleProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={twMerge(
        "flex w-full flex-col gap-2 overflow-y-hidden rounded bg-[#EBE8E86E]/40 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-between gap-2">
          <OptionsTitle
            name={name}
            icon={icon}
            action={action}
            actionIcon={actionIcon}
            actionTooltip={actionTooltip}
          />
          {headerAction}
        </div>
        {expandable && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="h-4 w-4 text-gray-500 hover:text-gray-300"
          >
            {expanded ? <MinusIcon /> : <PlusIcon />}
          </button>
        )}
      </div>
      {(expanded || !expandable) && (
        <div className="w-full overflow-y-auto">{children}</div>
      )}
    </div>
  );
};
