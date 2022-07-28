import { createCollapsibleListPlugin } from './createCollapsibleListPlugin';
import type { CollapsibleListPluginEditorConfig } from './types';
import { COLLAPSIBLE_LIST_TYPE } from './types';
import { ModalsMap } from './modals';
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createCollapsibleListData } from './createCollapsibleListData';
import { tiptapExtensions } from './tiptap/tiptap';
import type { TiptapEditorPlugin } from 'ricos-types';
import { getAddButtons } from './getAddButtons';
import { getToolbarButtons } from './getToolbarButtons';
import { TIPTAP_COLLAPSIBLE_LIST_TYPE } from 'ricos-content';

export const pluginCollapsibleList: EditorPluginCreator<
  CollapsibleListPluginEditorConfig
> = config => {
  const pluginConfig: CollapsibleListPluginEditorConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: COLLAPSIBLE_LIST_TYPE,
    createPlugin: createCollapsibleListPlugin,
    ModalsMap,
    createPluginData: createCollapsibleListData,
    tiptapExtensions,
    getAddButtons: (config, services) => getAddButtons(config, services),
    toolbar: {
      getButtons: (config, services) => getToolbarButtons(config, services),
      isVisible: selection =>
        selection.from === selection.to &&
        selection.$anchor?.path?.find(node => node?.type?.name === TIPTAP_COLLAPSIBLE_LIST_TYPE),
    },
  } as TiptapEditorPlugin;
};
