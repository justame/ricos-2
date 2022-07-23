import { createLink } from 'ricos-content/libs/nodeUtils';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { convertRelObjectToString, convertRelStringToObject } from 'wix-rich-content-common';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { createLinkData } from './createLinkData';
import { createLinkPlugin } from './createLinkPlugin';
import { DEFAULTS } from './defaults';
import LinkIcon from './LinkIcon';
import type { LinkPluginEditorConfig } from './types';
import { LINK_TYPE } from './types';

export const pluginLink: EditorPluginCreator<LinkPluginEditorConfig> = config => {
  const pluginConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: LINK_TYPE,
    createPlugin: createLinkPlugin,
    ModalsMap: {},
    createPluginData: createLinkData,
    textButtons: [
      {
        id: 'link',
        type: 'modal',
        presentation: {
          dataHook: 'LinkButton',
          tooltip: 'TextLinkButton_Tooltip',
          icon: LinkIcon,
        },
        attributes: {
          visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
          active: RESOLVERS_IDS.IS_TEXT_CONTAINS_LINK_OR_ANCHOR,
        },
        commands: {
          insertLink:
            ({ editorCommands }) =>
            linkData => {
              const { rel, target, url } = linkData;
              const relValue = convertRelObjectToString(convertRelStringToObject(rel));
              const link = createLink({ url, rel: relValue, target });
              editorCommands.chain().focus().setLink({ link }).run();
            },
          insertAnchor:
            ({ editorCommands }) =>
            data => {
              editorCommands.chain().focus().setAnchor(data).run();
            },
          removeLink:
            ({ editorCommands }) =>
            () => {
              editorCommands.chain().focus().unsetLink().run();
            },
          removeAnchor:
            ({ editorCommands }) =>
            () => {
              editorCommands.chain().focus().unsetAnchor().run();
            },
        },
      },
    ],
  };
};
