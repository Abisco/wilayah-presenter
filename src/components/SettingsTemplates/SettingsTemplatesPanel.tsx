import { useState } from "react";
import { useSettings, type SettingsTemplate } from "../../hooks/useSettings";
import { BookmarkIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const DEFAULT_TEMPLATE_ID = "default";

interface SettingsTemplatesPanelProps {
  templates: SettingsTemplate[];
  onRefresh: () => void;
}

export const SettingsTemplatesPanel = ({
  templates,
  onRefresh,
}: SettingsTemplatesPanelProps) => {
  const { saveTemplate, loadTemplate, deleteTemplate, loadDefaultSettings } =
    useSettings();
  const [templateName, setTemplateName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      saveTemplate(templateName.trim());
      onRefresh();
      setTemplateName("");
      setShowSaveInput(false);
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    if (templateId === DEFAULT_TEMPLATE_ID) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      loadDefaultSettings();
    } else {
      loadTemplate(templateId);
    }
  };

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTemplate(templateId);
    onRefresh();
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center justify-between border-b border-gray-300 pb-2">
        <h3 className="text-base font-bold text-gray-900">
          Settings Templates
        </h3>
      </div>

      {/* Save current settings as template */}
      <div className="flex flex-col gap-2">
        {!showSaveInput ? (
          <button
            onClick={() => setShowSaveInput(true)}
            className="flex items-center gap-2 rounded border border-gray-400 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <PlusIcon className="h-4 w-4" />
            Save Current Settings
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveTemplate();
                } else if (e.key === "Escape") {
                  setShowSaveInput(false);
                  setTemplateName("");
                }
              }}
              placeholder="Template name..."
              className="rounded border border-gray-400 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className="flex-1 rounded border border-blue-500 bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveInput(false);
                  setTemplateName("");
                }}
                className="flex-1 rounded border border-gray-400 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Templates list */}
      <div className="max-h-[300px] overflow-y-auto">
        <div className="flex flex-col gap-1">
          {/* Default template - always shown first */}
          <div className="group flex items-center justify-between rounded border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50">
            <button
              onClick={() => handleLoadTemplate(DEFAULT_TEMPLATE_ID)}
              className="flex flex-1 items-center gap-2 text-left"
            >
              <BookmarkIcon className="h-4 w-4 text-gray-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  Default
                </span>
                <span className="text-xs text-gray-500">Original settings</span>
              </div>
            </button>
            {/* No delete button for default template */}
          </div>

          {/* User templates */}
          {templates.length === 0 ? (
            <div className="py-2 text-center text-sm text-gray-500">
              No custom templates saved yet
            </div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className="group flex items-center justify-between rounded border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50"
              >
                <button
                  onClick={() => handleLoadTemplate(template.id)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <BookmarkIcon className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {template.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
                <button
                  onClick={(e) => handleDeleteTemplate(template.id, e)}
                  className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                  title="Delete template"
                  aria-label={`Delete template ${template.name}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
