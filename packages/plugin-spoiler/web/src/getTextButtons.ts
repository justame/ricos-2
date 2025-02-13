import type { EditorCommands, FormattingToolbarButtonConfig } from 'ricos-types';
import { Decoration_Type } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import SpoilerTextButtonIcon from './icons/SpoilerTextButtonIcon';

export const getTextButtons = (): FormattingToolbarButtonConfig[] => {
  return [
    {
      id: Decoration_Type.SPOILER,
      type: 'toggle',
      presentation: {
        dataHook: 'textSpoilerButton',
        tooltip: 'Spoiler_Insert_Tooltip',
        icon: SpoilerTextButtonIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_SPOILER,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.toggleInlineStyle('spoiler');
        return true;
      },
    },
  ];
};
