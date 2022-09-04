import type { EditorCommands, FormattingToolbarButtonConfig } from 'ricos-types';
import { Node_Type } from 'ricos-types';
import { CODE_BLOCK_TYPE } from 'wix-rich-content-common';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import CodeBlockIcon from './icons/toolbars-v3/CodeBlockIcon';

export const getTextButtons = (): FormattingToolbarButtonConfig[] => {
  return [
    {
      id: Node_Type.CODE_BLOCK,
      type: 'toggle',
      presentation: {
        dataHook: 'TextCodeBlockButton',
        tooltip: 'TextCodeBlockButton_Tooltip',
        tooltipShortcut: {
          MacOS: ' (⌘⇧C)',
          Windows: ' (Ctrl+⇧+C)',
        },
        icon: CodeBlockIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        active: RESOLVERS_IDS.IS_TEXT_CONTAINS_CODE_BLOCK,
        disabled: RESOLVERS_IDS.IS_NODE_SELECTED,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.setBlockType(CODE_BLOCK_TYPE);
        return true;
      },
    },
  ];
};
