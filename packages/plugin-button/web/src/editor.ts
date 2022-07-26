import { createActionButtonPlugin, createLinkButtonPlugin } from './createButtonPlugin';
import { DEFAULT_CONFIG } from './constants';
import type { LinkButtonPluginEditorConfig, ActionButtonPluginEditorConfig } from './types';
import { LINK_BUTTON_TYPE, ACTION_BUTTON_TYPE } from './types';
import { ModalsMap } from './modals';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createButtonData } from './createButtonData';
import { tiptapExtensionsMap } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getToolbarButtons } from './getToolbarButtons';
import { getAddButtons } from './getAddButtons';

const pluginButton = (createPlugin, type, config) => {
  return {
    config: { ...DEFAULT_CONFIG, ...config },
    type,
    createPlugin,
    ModalsMap,
    createPluginData: createButtonData,
    toolbar: { getButtons: config => getToolbarButtons(config, type) },
    getAddButtons: config => getAddButtons(config, type),
    tiptapExtensions: tiptapExtensionsMap[type],
  } as TiptapEditorPlugin;
};

export const pluginLinkButton: EditorPluginCreator<LinkButtonPluginEditorConfig> = config => {
  return pluginButton(createLinkButtonPlugin, LINK_BUTTON_TYPE, config);
};

export const pluginActionButton: EditorPluginCreator<ActionButtonPluginEditorConfig> = config => {
  return pluginButton(createActionButtonPlugin, ACTION_BUTTON_TYPE, config);
};
