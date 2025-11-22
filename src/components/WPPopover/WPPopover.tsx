import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { useEffect, useRef } from "react";
import type { Placement } from "@floating-ui/react";

interface WPPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
  offset?: number;
  panelClassName?: string;
  triggerClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
  portal?: boolean;
  adaptiveWidth?: boolean;
}

const PopoverContent = ({
  open,
  trigger,
  children,
  placement,
  offset,
  panelClassName,
  triggerClassName,
  onOpen,
  onClose,
  portal,
  adaptiveWidth,
}: {
  open: boolean;
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement: Placement;
  offset: number;
  panelClassName: string;
  triggerClassName: string;
  onOpen?: () => void;
  onClose?: () => void;
  portal: boolean;
  adaptiveWidth: boolean;
}) => {
  const prevOpenRef = useRef<boolean | undefined>(undefined);

  // Call onOpen/onClose callbacks only when state actually changes
  useEffect(() => {
    if (prevOpenRef.current === undefined) {
      prevOpenRef.current = open;
      return;
    }

    if (open && !prevOpenRef.current && onOpen) {
      onOpen();
    } else if (!open && prevOpenRef.current && onClose) {
      onClose();
    }

    prevOpenRef.current = open;
  }, [open, onOpen, onClose]);

  return (
    <Float
      placement={placement}
      offset={offset}
      as="div"
      className="relative"
      portal={portal}
      adaptiveWidth={adaptiveWidth}
    >
      <Popover.Button as="div" className={triggerClassName}>
        {trigger}
      </Popover.Button>

      <Popover.Panel className={`relative z-10 ${panelClassName}`}>
        {children}
      </Popover.Panel>
    </Float>
  );
};

export const WPPopover = ({
  trigger,
  children,
  placement = "bottom-end",
  offset = 4,
  panelClassName = "",
  triggerClassName = "cursor-pointer",
  onOpen,
  onClose,
  portal = true,
  adaptiveWidth = true,
}: WPPopoverProps) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <PopoverContent
          open={open}
          trigger={trigger}
          placement={placement}
          offset={offset}
          panelClassName={panelClassName}
          triggerClassName={triggerClassName}
          onOpen={onOpen}
          onClose={onClose}
          portal={portal}
          adaptiveWidth={adaptiveWidth}
        >
          {children}
        </PopoverContent>
      )}
    </Popover>
  );
};

