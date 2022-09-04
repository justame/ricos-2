import type { TiptapEditorPlugin } from 'ricos-types';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { DEFAULTS } from './consts';
import { createImageData } from './createImageData';
import { createImagePlugin } from './createImagePlugin';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';
import { ModalsMap } from './modals';
import { tiptapExtensions } from './tiptap/tiptap';
import type { ImagePluginEditorConfig } from './types';
import { IMAGE_TYPE } from './types';

export const pluginImage: EditorPluginCreator<ImagePluginEditorConfig> = config => {
  const pluginConfig: ImagePluginEditorConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: IMAGE_TYPE,
    createPlugin: createImagePlugin,
    ModalsMap,
    createPluginData: createImageData,
    tiptapExtensions,
    toolbar: { getButtons: (config, services) => getToolbarButtons(config, services) },
    getAddButtons: (config, services) => getAddButtons(config, services),
  } as TiptapEditorPlugin;
};
