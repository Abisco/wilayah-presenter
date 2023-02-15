import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ListBulletIcon, XCircleIcon } from '@heroicons/react/24/solid'

import { OptionsBox } from './OptionsBox';

export default {
  title: 'Components/OptionsBox',
  component: OptionsBox,
} as ComponentMeta<typeof OptionsBox>;

const Template: ComponentStory<typeof OptionsBox> = (args) => <OptionsBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Playlist',
  icon: <ListBulletIcon/>,
  expandable: false,
  children: <div className='w-max h-12'>Content</div>
};

export const Expandable = Template.bind({});
Expandable.args = {
  name: 'Playlist',
  icon: <ListBulletIcon/>,
  expandable: true,
  children: <div className='w-max h-12'>Content</div>
};

export const WithAction = Template.bind({});
WithAction.args = {
  name: 'Playlist',
  icon: <ListBulletIcon/>,
  action: () => console.log('action'),
  actionIcon: <XCircleIcon className='text-red-500'/>,
  actionTooltip: 'Close',
  children: <div className='w-max h-12'>Content</div>
};
