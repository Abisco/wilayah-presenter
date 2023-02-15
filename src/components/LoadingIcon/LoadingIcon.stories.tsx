import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { LoadingIcon } from "./LoadingIcon";

export default {
  title: "Components/LoadingIcon",
  component: LoadingIcon,
} as ComponentMeta<typeof LoadingIcon>;

const Template: ComponentStory<typeof LoadingIcon> = (args) => (
  <LoadingIcon {...args} />
);

export const Default = Template.bind({});
Default.args = {};
