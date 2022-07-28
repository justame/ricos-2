import { createVideoPlugin } from './createVideoPlugin';
import type { VideoPluginEditorConfig } from './types';
import { VIDEO_TYPE } from './types';
import { DEFAULTS } from './defaults';
import { ModalsMap } from './modals';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createVideoData } from './createVideoData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';

export const pluginVideo: EditorPluginCreator<VideoPluginEditorConfig> = config => {
  const pluginConfig: VideoPluginEditorConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: VIDEO_TYPE,
    createPlugin: createVideoPlugin,
    ModalsMap,
    createPluginData: createVideoData,
    tiptapExtensions,
    getAddButtons: (config, services) => getAddButtons(config, services),
    toolbar: { getButtons: (config, services) => getToolbarButtons(config, services) },
  } as TiptapEditorPlugin;
};
