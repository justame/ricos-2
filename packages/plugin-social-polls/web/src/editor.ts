import { createPollPlugin } from './createPollPlugin';
import type { PollPluginEditorConfig } from './types';
import { POLL_TYPE } from './types';
import { DEFAULT_COMPONENT_DATA } from './defaults';
import { ModalsMap } from './modals';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createPollData } from './createPollData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';

export const pluginPoll: EditorPluginCreator<PollPluginEditorConfig> = config => {
  const pluginConfig: PollPluginEditorConfig = { ...DEFAULT_COMPONENT_DATA.config, ...config };
  return {
    config: pluginConfig,
    type: POLL_TYPE,
    createPlugin: createPollPlugin,
    ModalsMap,
    createPluginData: createPollData,
    tiptapExtensions,
    getAddButtons: (config, services) => getAddButtons(config, services),
    toolbar: { getButtons: (config, services) => getToolbarButtons(config, services) },
  } as TiptapEditorPlugin;
};
