import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ListBulletIcon, XCircleIcon } from '@heroicons/react/24/solid'

import { OptionsTitle } from './OptionsTitle';

export default {
  title: 'Components/OptionsTitle',
  component: OptionsTitle,
} as ComponentMeta<typeof OptionsTitle>;

const Template: ComponentStory<typeof OptionsTitle> = (args) => <OptionsTitle {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Playlist',
  icon: <ListBulletIcon/>
};

export const WithAction = Template.bind({});
WithAction.args = {
  name: 'Playlist',
  icon: <ListBulletIcon/>,
  action: () => console.log('action'),
  actionIcon: <XCircleIcon className='text-red-500'/>,
  actionTooltip: 'Close'
};
