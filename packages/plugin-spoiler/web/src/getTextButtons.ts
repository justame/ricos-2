import { alwaysVisibleResolver, isTextContainsSpoilerResolver } from 'wix-rich-content-toolbars-v3';
import SpoilerTextButtonIcon from './icons/SpoilerTextButtonIcon';
import type { IToolbarItemConfigTiptap } from 'ricos-types';

export const getTextButtons = (): IToolbarItemConfigTiptap[] => {
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
        visible: alwaysVisibleResolver,
        active: isTextContainsSpoilerResolver,
      },
      commands: {
        toggleSpoiler:
          ({ editorCommands }) =>
          () => {
            editorCommands.chain().focus().toggleSpoiler().run();
          },
      },
    },
  ];
};
