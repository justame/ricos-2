import { createHtmlPlugin } from './createHtmlPlugin';
import type { HtmlPluginEditorConfig } from './types';
import { HTML_TYPE } from './types';
import { DEFAULTS_CONFIG } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createHtmlData } from './createHtmlData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';

export const pluginHtml: EditorPluginCreator<HtmlPluginEditorConfig> = config => {
  const pluginConfig: HtmlPluginEditorConfig = { ...DEFAULTS_CONFIG, ...config };
  return {
    config: pluginConfig,
    type: HTML_TYPE,
    createPlugin: createHtmlPlugin,
    ModalsMap: {},
    createPluginData: createHtmlData,
    tiptapExtensions,
    addButtons: getAddButtons(config),
    toolbar: { buttons: getToolbarButtons(config) },
  } as TiptapEditorPlugin;
};
