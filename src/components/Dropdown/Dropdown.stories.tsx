import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Dropdown } from './Dropdown';

export default {
  title: 'BaseComponents/Dropdown',
  component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      label: 'Item 1',
      value: 'item-1',
      onClick: () => alert('Item 1 clicked')
    },
    {
      label: 'Item 2',
      value: 'item-2',
      onClick: () => alert('Item 2 clicked')
    },
    {
      label: 'Item 3',
      value: 'item-3',
      onClick: () => alert('Item 3 clicked')
    }
  ],
  trigger: <button>Hello there</button>,
  showArrow: true
};
