import type { FormattingToolbarButtonConfig } from 'ricos-types';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import CodeBlockIcon from './icons/toolbars-v3/CodeBlockIcon';

export const getTextButtons = (): FormattingToolbarButtonConfig[] => {
  return [
    {
      id: 'codeBlock',
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
      },
      commands: {
        toggleCodeblock:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().toggleCodeBlock().run();
          },
      },
    },
  ];
};
