import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Toolbar } from "./Toolbar";

export default {
  title: "Components/Toolbar",
  component: Toolbar,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Toolbar>;

const Template: ComponentStory<typeof Toolbar> = () => <Toolbar />;

export const Primary = Template.bind({});
