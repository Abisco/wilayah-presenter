import React from 'react';
import { Tooltip } from '../Tooltip/Tooltip';

export interface OptionsTitleProps {
  name: string;
  icon?: JSX.Element;
  action?: () => void;
  actionIcon?: React.ReactNode;
  actionTooltip?: string;
}

export const OptionsTitle = ({
  name,
  icon,
  action,
  actionIcon,
  actionTooltip
}: OptionsTitleProps) => {

  return (
    <div className='flex w-max items-center gap-4'>
      {icon && (
        <span className='h-6 w-6 text-black'>{icon}</span>
      )}
      <h1 className='text-xl font-bold text-black'>
        {name}
      </h1>
      {action && (
        <Tooltip text={actionTooltip}>
          <button onClick={action} className='w-6 h-6'>
            {actionIcon}
          </button>
        </Tooltip>
      )}
    </div>
  );
};
