import { createLinkPreviewPlugin } from './createLinkPreviewPlugin';
import type { LinkPreviewPluginEditorConfig } from './types';
import { LINK_PREVIEW_TYPE } from './types';
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getAddButtons } from './getAddButtons';

export const pluginLinkPreview: EditorPluginCreator<LinkPreviewPluginEditorConfig> = config => {
  const pluginConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: LINK_PREVIEW_TYPE,
    createPlugin: createLinkPreviewPlugin,
    ModalsMap: {},
    tiptapExtensions,
    addButtons: getAddButtons(config),
  } as TiptapEditorPlugin;
};
