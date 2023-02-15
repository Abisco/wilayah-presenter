interface KeyboardKeyProps {
  keyName: string;
}

export const KeyboardKey = ({ keyName }: KeyboardKeyProps) => (
  <div className="flex items-center justify-center rounded-md bg-[#EAE9E9] py-1.5 px-2 drop-shadow-md">
    <span className="text-[10px] font-bold">{keyName}</span>
  </div>
);
