import type { EditorPluginCreator } from 'wix-rich-content-common';
import { Decoration_Type, RICOS_LINK_TYPE, RICOS_ANCHOR_TYPE } from 'wix-rich-content-common';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { createLinkData } from './createLinkData';
import { createLinkPlugin } from './createLinkPlugin';
import { DEFAULTS } from './defaults';
import LinkIcon from './LinkIcon';
import type { LinkPluginEditorConfig } from './types';
import { LINK_TYPE } from './types';
import LinkPanelComponent from './LinkPanelComponent';

const FORMATTING_LINK_MODAL_ID = `${Decoration_Type.LINK}.modal`;

export const pluginLink: EditorPluginCreator<LinkPluginEditorConfig> = config => {
  const pluginConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: LINK_TYPE,
    createPlugin: createLinkPlugin,
    ModalsMap: {},
    createPluginData: createLinkData,
    shortcuts: [
      {
        name: Decoration_Type.LINK,
        description: 'Link',
        group: 'formatting',
        keys: {
          macOs: 'Meta+K',
          windows: 'Ctrl+K',
        },
        enabled: true,
        command(_commands, modalService) {
          if (_commands.hasLinkInSelection()) {
            const link = _commands.getLinkDataInSelection();
            const linkType = link?.url ? RICOS_LINK_TYPE : RICOS_ANCHOR_TYPE;
            _commands.deleteDecoration(linkType);
          } else {
            modalService.openModal(FORMATTING_LINK_MODAL_ID, {
              componentProps: {
                closeModal: () => modalService.closeModal(FORMATTING_LINK_MODAL_ID),
              },
              layout: 'dialog',
            });
          }
        },
      },
    ],
    textButtons: [
      {
        id: Decoration_Type.LINK,
        type: 'modal',
        presentation: {
          dataHook: 'LinkButton',
          tooltip: 'TextLinkButton_Tooltip',
          icon: LinkIcon,
        },
        attributes: {
          visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
          active: RESOLVERS_IDS.IS_TEXT_CONTAINS_LINK_OR_ANCHOR,
          disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
        },
        commands: {},
        modal: {
          id: FORMATTING_LINK_MODAL_ID,
          Component: LinkPanelComponent,
        },
      },
    ],
  };
};
