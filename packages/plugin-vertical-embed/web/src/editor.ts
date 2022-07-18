import { createVerticalEmbedPlugin } from './createVerticalEmbedPlugin';
import type { VerticalEmbedPluginEditorConfig } from './types';
import { VERTICAL_EMBED_TYPE } from './types';
import { ModalsMap } from './modals';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-tiptap-types';
import { getToolbarButtons } from './getToolbarButtons';
import { getAddButtons } from './getAddButtons';

export const pluginVerticalEmbed: EditorPluginCreator<VerticalEmbedPluginEditorConfig> = config => {
  const pluginConfig = { ...config };
  return {
    config: pluginConfig,
    type: VERTICAL_EMBED_TYPE,
    createPlugin: createVerticalEmbedPlugin,
    ModalsMap,
    tiptapExtensions,
    toolbar: { buttons: getToolbarButtons(config) },
    addButtons: getAddButtons(config),
  } as TiptapEditorPlugin;
};
