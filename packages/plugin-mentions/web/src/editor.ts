import { createExternalMentionsPlugin } from './createMentionsPlugin';
import type { MentionsPluginEditorConfig } from './types';
import { MENTION_TYPE } from './types';
import { DEFAULTS } from './defaultSettings';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createMentionData } from './createMentionData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';

export const pluginMentions: EditorPluginCreator<MentionsPluginEditorConfig> = config => {
  const pluginConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: MENTION_TYPE,
    createPlugin: createExternalMentionsPlugin,
    ModalsMap: {},
    createPluginData: createMentionData,
    tiptapExtensions,
  } as TiptapEditorPlugin;
};
