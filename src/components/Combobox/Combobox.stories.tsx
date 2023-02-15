import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Combobox } from './Combobox';

export default {
  title: 'BaseComponents/Combobox',
  component: Combobox,
} as ComponentMeta<typeof Combobox>;

const Template: ComponentStory<typeof Combobox> = (args) => <Combobox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      label: 'Item 1',
      value: 'item-1',
    },
    {
      label: 'Item 2',
      value: 'item-2',
    },
    {
      label: 'Item 3',
      value: 'item-3',
    }
  ],
};
