import { createGiphyPlugin } from './createGiphyPlugin';
import { ModalsMap } from './modals';
import { DEFAULTS } from './constants';
import type { GiphyPluginEditorConfig } from './types';
import { GIPHY_TYPE } from './types';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createGiphyData } from './createGiphyData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-tiptap-types';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';

export const pluginGiphy: EditorPluginCreator<GiphyPluginEditorConfig> = config => {
  const pluginConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: GIPHY_TYPE,
    createPlugin: createGiphyPlugin,
    ModalsMap,
    createPluginData: createGiphyData,
    tiptapExtensions,
    addButtons: getAddButtons(config),
    toolbar: { buttons: getToolbarButtons(config) },
  } as TiptapEditorPlugin;
};
