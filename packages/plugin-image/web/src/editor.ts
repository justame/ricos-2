import { createImagePlugin } from './createImagePlugin';
import type { ImagePluginEditorConfig } from './types';
import { IMAGE_TYPE } from './types';
import { ModalsMap } from './modals';
import { DEFAULTS } from './consts';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createImageData } from './createImageData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-tiptap-types';
import { getToolbarButtons } from './getToolbarButtons';
import { getAddButtons } from './getAddButtons';

export const pluginImage: EditorPluginCreator<ImagePluginEditorConfig> = config => {
  const pluginConfig: ImagePluginEditorConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: IMAGE_TYPE,
    createPlugin: createImagePlugin,
    ModalsMap,
    createPluginData: createImageData,
    tiptapExtensions,
    toolbar: { buttons: getToolbarButtons(pluginConfig) },
    addButtons: getAddButtons(pluginConfig),
    reconfigure: helpers => {
      pluginConfig.handleFileSelection = helpers.handleFileSelection;
      pluginConfig.handleFileUpload = helpers.handleFileUpload;
    },
  } as TiptapEditorPlugin;
};
