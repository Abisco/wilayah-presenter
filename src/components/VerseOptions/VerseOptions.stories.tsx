import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { VerseOptions } from './VerseOptions';

export default {
  title: 'Components/Options/Verse',
  component: VerseOptions,
} as ComponentMeta<typeof VerseOptions>;

const Template: ComponentStory<typeof VerseOptions> = (args) => <VerseOptions {...args} />;

export const Default = Template.bind({});
Default.args = {
};
