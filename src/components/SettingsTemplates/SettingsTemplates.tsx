import { useState, useEffect, useCallback } from "react";
import { useSettings } from "../../hooks/useSettings";
import { SettingsTemplatesPanel } from "./SettingsTemplatesPanel";
import { WPPopover } from "../WPPopover/WPPopover";

interface SettingsTemplatesProps {
  trigger: React.ReactNode;
}

export const SettingsTemplates = ({ trigger }: SettingsTemplatesProps) => {
  const { getTemplates } = useSettings();
  const [templates, setTemplates] = useState(() => getTemplates());

  const refreshTemplates = useCallback(() => {
    setTemplates(getTemplates());
  }, [getTemplates]);

  // Load templates on mount (client-side only)
  useEffect(() => {
    refreshTemplates();
  }, [refreshTemplates]);

  return (
    <WPPopover
      trigger={trigger}
      placement="bottom-end"
      triggerClassName="h-fit cursor-pointer -mb-1"
      panelClassName="w-[320px] border bg-gray-100 shadow-lg"
      onOpen={refreshTemplates}
    >
      <SettingsTemplatesPanel
        templates={templates}
        onRefresh={refreshTemplates}
      />
    </WPPopover>
  );
};
