import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { KeyboardKey } from "./KeyboardKey";

export default {
  title: "Components/KeyboardKey",
  component: KeyboardKey,
} as ComponentMeta<typeof KeyboardKey>;

const Template: ComponentStory<typeof KeyboardKey> = (args) => (
  <KeyboardKey {...args} />
);

export const Default = Template.bind({});
Default.args = {
  keyName: "Backspace",
};
