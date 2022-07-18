import { createTextColorPlugin } from './createTextColorPlugin';
import { createTextHighlightPlugin } from './createTextHighlightPlugin';
import type { TextColorPluginEditorConfig, TextHighlightPluginEditorConfig } from './types';
import { TEXT_COLOR_TYPE, TEXT_HIGHLIGHT_TYPE } from './types';
import { DEFAULTS } from './constants';
import { ModalsMap } from './modals';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import type { TiptapEditorPlugin } from 'ricos-types';
import { tiptapExtensions } from './tiptap';
import { getTextColorTextButtons, getTextHighlightTextButtons } from './getTextButtons';

export const pluginTextColor: EditorPluginCreator<TextColorPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.configTextColor.editor, ...config },
    type: TEXT_COLOR_TYPE,
    createPlugin: createTextColorPlugin,
    ModalsMap,
    tiptapExtensions,
    textButtons: getTextColorTextButtons(),
  } as TiptapEditorPlugin;
};

export const pluginTextHighlight: EditorPluginCreator<TextHighlightPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.configTextHighlight.editor, ...config },
    type: TEXT_HIGHLIGHT_TYPE,
    createPlugin: createTextHighlightPlugin,
    ModalsMap: {},
    textButtons: getTextHighlightTextButtons(),
  };
};
