import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { twMerge } from 'tailwind-merge';

interface DropdownProps {
  items: Array<{
    label: string;
    value: string;
    onClick: () => void;
  }>
  trigger: React.ReactNode;
  showArrow?: boolean;
}

export const Dropdown = ({
  items,
  trigger,
  showArrow = true
}: DropdownProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {trigger}
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content className={twMerge(
          "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
          "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56",
          "bg-white"
        )}>
        {items.map((item) => (
          <DropdownMenu.Item key={item.value} onSelect={item.onClick} className={twMerge(
            "flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none",
            "text-gray-400 focus:bg-gray-50"
          )}>
            <span className="flex-grow text-gray-800">{item.label}</span>
          </DropdownMenu.Item>
        ))}
        {showArrow && (
          <DropdownMenu.Arrow />
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);