import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';
import type { IToolbarItemConfigTiptap } from 'ricos-types';
import increaseIndentPluginIcon from './icons/toolbars-v3/increaseIndentPluginIcon';
import decreaseIndentPluginIcon from './icons/toolbars-v3/decreaseIndentPluginIcon';

export const getTextButtons = (): IToolbarItemConfigTiptap[] => {
  return [
    {
      id: 'increaseIndent',
      type: 'toggle',
      presentation: {
        dataHook: 'increaseIndentButton',
        tooltip: 'increaseIndentButton_Tooltip',
        icon: increaseIndentPluginIcon,
      },
      attributes: {
        visible: alwaysVisibleResolver,
      },
      commands: {
        increaseIndent:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().indent().run();
          },
      },
    },
    {
      id: 'decreaseIndent',
      type: 'toggle',
      presentation: {
        dataHook: 'decreaseIndentButton',
        tooltip: 'decreaseIndentButton_Tooltip',
        icon: decreaseIndentPluginIcon,
      },
      attributes: {
        visible: alwaysVisibleResolver,
      },
      commands: {
        decreaseIndent:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().outdent().run();
          },
      },
    },
  ];
};
