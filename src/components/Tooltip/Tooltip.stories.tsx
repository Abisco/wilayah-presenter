import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid'

import { Tooltip } from './Tooltip';

export default {
  title: 'BaseComponents/Tooltip',
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: 'Tooltip',
  children: <div className='w-max'>Hover me</div>,
};

export const WithButton = Template.bind({});
WithButton.args = {
  text: 'Tooltip',
  children: <button>
    <PlusCircleIcon className="h-6 w-6" />
  </button>,
};