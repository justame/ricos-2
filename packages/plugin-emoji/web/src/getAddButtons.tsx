import EmojiPluginIcon from './icons/EmojiPluginIcon';
import { INSERT_PLUGIN_BUTTONS, TOOLBARS } from 'wix-rich-content-editor-common';
import InsertModal from './modals/InsertModal';
import type { AddButton } from 'ricos-types';
import { emojiModals, EMOJI_TYPE } from './types';

export const getAddButtons = (config, services): AddButton[] => {
  return [
    {
      id: EMOJI_TYPE,
      label: INSERT_PLUGIN_BUTTONS.EMOJI,
      dataHook: INSERT_PLUGIN_BUTTONS.EMOJI,
      icon: EmojiPluginIcon,
      tooltip: 'EmojiPlugin_InsertButton_Tooltip',
      toolbars: [TOOLBARS.MOBILE, TOOLBARS.FOOTER, TOOLBARS.SIDE],
      command: editorCommands => true,
      modal: {
        id: emojiModals.insert,
        Component: InsertModal,
      },
      menuConfig: {
        tags: 'Emoji_plugin_search_tags',
      },
    },
  ];
};
