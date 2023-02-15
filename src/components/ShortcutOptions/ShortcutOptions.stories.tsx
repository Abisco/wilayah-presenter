import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { ShortcutOptions } from "./ShortcutOptions";

export default {
  title: "Components/Options/Shortcuts",
  component: ShortcutOptions,
} as ComponentMeta<typeof ShortcutOptions>;

const Template: ComponentStory<typeof ShortcutOptions> = (args) => (
  <ShortcutOptions {...args} />
);

export const Default = Template.bind({});
Default.args = {
  expandable: false,
};
