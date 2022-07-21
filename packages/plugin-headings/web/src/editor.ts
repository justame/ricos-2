import type { TiptapEditorPlugin } from 'ricos-types';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createHeadingsPlugin } from './createHeadingsPlugin';
import { DEFAULTS } from './defaults';
import { ModalsMap } from './modals';
import { tiptapExtensions } from './tiptap';
import type { HeadingsPluginEditorConfig } from './types';
import { HEADINGS_DROPDOWN_TYPE } from './types';
import { getTextButtons } from './getTextButtons';

export const pluginHeadings: EditorPluginCreator<HeadingsPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: HEADINGS_DROPDOWN_TYPE,
    createPlugin: createHeadingsPlugin,
    ModalsMap,
    tiptapExtensions,
    textButtons: getTextButtons(),
  } as TiptapEditorPlugin;
};
