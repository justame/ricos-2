import { createImagePlugin } from './createImagePlugin';
import type { ImagePluginEditorConfig } from './types';
import { IMAGE_TYPE } from './types';
import { ModalsMap } from './modals';
import { DEFAULTS } from './consts';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createImageData } from './createImageData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getToolbarButtons } from './getToolbarButtons';
import { getAddButtons } from './getAddButtons';
import { Uploader } from 'wix-rich-content-plugin-commons';

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
      pluginConfig.uploader = new Uploader(helpers.handleFileUpload);
    },
  } as TiptapEditorPlugin;
};
