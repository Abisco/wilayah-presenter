import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { SettingsOptions } from './SettingsOptions';

export default {
  title: 'Components/Options/Settings',
  component: SettingsOptions,
} as ComponentMeta<typeof SettingsOptions>;

const Template: ComponentStory<typeof SettingsOptions> = (args) => <SettingsOptions {...args} />;

export const Default = Template.bind({});
Default.args = {
  expandable: false
};
