import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Presentation } from './Presentation';
import { currentVerseMock } from '../../mocks/verseMocks';

export default {
  title: 'Components/Presentation',
  component: Presentation,
} as ComponentMeta<typeof Presentation>;

const Template: ComponentStory<typeof Presentation> = (args) => <Presentation {...args} />;

export const LowerThird = Template.bind({});
LowerThird.args = {
  currentVerse: currentVerseMock,
  surahData: {
    id: 1,
    surahNumber: 1,
    surahNameArabic: 'الفاتحة',
    surahNameEnglish: 'The Opening',
    includeBismillah: false,
    type: 'MAKKAH',
    versesCount: 7,
    surahNameTransliteration: 'Al-Fatihah',
  }
};
