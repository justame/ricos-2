import { createAudioData } from './createAudioData';

import { createAudioPlugin } from './createAudioPlugin';
import type { AudioPluginEditorConfig } from './types';
import { AUDIO_TYPE } from './types';
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-tiptap-types';

export const pluginAudio: EditorPluginCreator<AudioPluginEditorConfig> = config => {
  const pluginConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: AUDIO_TYPE,
    createPlugin: createAudioPlugin,
    createPluginData: createAudioData,
    tiptapExtensions,
  } as TiptapEditorPlugin;
};
