import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { VersePreviewBox } from "./VersePreviewBox";
import { currentVerseMock } from "../../mocks/verseMocks";

export default {
  title: "BaseComponents/VersePreviewBox",
  component: VersePreviewBox,
} as ComponentMeta<typeof VersePreviewBox>;

const Template: ComponentStory<typeof VersePreviewBox> = (args) => (
  <VersePreviewBox {...args} />
);

export const Default = Template.bind({});
Default.args = {
  verse: {
    ...currentVerseMock,
  },
};
