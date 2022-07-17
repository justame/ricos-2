import { createAudioData } from './createAudioData';
import { createAudioPlugin } from './createAudioPlugin';
import type { AudioPluginEditorConfig } from './types';
import { AUDIO_TYPE } from './types';
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-tiptap-types';
import { getToolbarButtons } from './getToolbarButtons';
import { getAddButtons } from './getAddButtons';

export const pluginAudio: EditorPluginCreator<AudioPluginEditorConfig> = config => {
  const pluginConfig: AudioPluginEditorConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: AUDIO_TYPE,
    createPlugin: createAudioPlugin,
    createPluginData: createAudioData,
    tiptapExtensions,
    toolbar: { buttons: getToolbarButtons(pluginConfig) },
    addButtons: getAddButtons(pluginConfig),
    reconfigure: helpers => {
      pluginConfig.handleFileSelection = helpers.handleFileSelection;
      pluginConfig.handleFileUpload = helpers.handleFileUpload;
    },
  } as TiptapEditorPlugin;
};
