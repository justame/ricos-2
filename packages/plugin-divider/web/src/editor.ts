import { createDividerPlugin } from './createDividerPlugin';
import { DEFAULTS } from './defaults';
import type { DividerPluginEditorConfig } from './types';
import { DIVIDER_TYPE } from './types';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createDividerData } from './createDividerData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';

export const pluginDivider: EditorPluginCreator<DividerPluginEditorConfig> = config => {
  const pluginConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: DIVIDER_TYPE,
    createPlugin: createDividerPlugin,
    ModalsMap: {},
    createPluginData: createDividerData,
    tiptapExtensions,
    getAddButtons: (config, services) => getAddButtons(config, services),
    toolbar: { getButtons: (config, services) => getToolbarButtons(config, services) },
  } as TiptapEditorPlugin;
};
