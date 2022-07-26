import type { FormattingToolbarButtonConfig } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import SpoilerTextButtonIcon from './icons/SpoilerTextButtonIcon';

export const getTextButtons = (): FormattingToolbarButtonConfig[] => {
  return [
    {
      id: 'spoiler',
      type: 'toggle',
      presentation: {
        dataHook: 'textSpoilerButton',
        tooltip: 'Spoiler_Insert_Tooltip',
        icon: SpoilerTextButtonIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_SPOILER,
      },
      commands: {
        toggleSpoiler:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().toggleSpoiler().run();
          },
      },
    },
  ];
};
