import { createGalleryPlugin } from './createGalleryPlugin';
import type { GalleryPluginEditorConfig } from './types';
import { GALLERY_TYPE } from './types';
import { ModalsMap } from './modals';
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createGalleryData } from './createGalleryData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getToolbarButtons } from './getToolbarButtons';
import { getAddButtons } from './getAddButtons';
import { GalleryPluginService } from './toolbar/galleryPluginService';

const galleryPluginService = new GalleryPluginService();

export const pluginGallery: EditorPluginCreator<GalleryPluginEditorConfig> = config => {
  const pluginConfig: GalleryPluginEditorConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: GALLERY_TYPE,
    createPlugin: createGalleryPlugin,
    ModalsMap,
    createPluginData: createGalleryData,
    tiptapExtensions,
    getAddButtons: (config, services) => getAddButtons(config, services, galleryPluginService),
    toolbar: {
      getButtons: (config, services) => getToolbarButtons(config, services, galleryPluginService),
    },
  } as TiptapEditorPlugin;
};
