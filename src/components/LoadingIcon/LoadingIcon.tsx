import { twMerge } from "tailwind-merge";

interface LoadingIconProps {
  className?: string;
}

export const LoadingIcon = ({ className = "" }: LoadingIconProps) => {
  return (
    <div className="flex items-center justify-center ">
      <div
        className={twMerge(
          "h-24 w-24 animate-spin rounded-full border-l-2 border-blue-600",
          className
        )}
      ></div>
    </div>
  );
};
