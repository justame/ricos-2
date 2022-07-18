import {
  alwaysVisibleResolver,
  isTextContainsCodeblockResolver,
} from 'wix-rich-content-toolbars-v3';
import type { IToolbarItemConfigTiptap } from 'ricos-types';
import CodeBlockIcon from './icons/toolbars-v3/CodeBlockIcon';

export const getTextButtons = (): IToolbarItemConfigTiptap[] => {
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
        visible: alwaysVisibleResolver,
        active: isTextContainsCodeblockResolver,
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
