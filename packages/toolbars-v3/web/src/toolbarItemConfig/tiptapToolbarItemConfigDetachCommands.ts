// import { ContentResolver } from './ContentResolver';
import { BoldIcon, ItalicIcon, UnderlineIcon, SpoilerButtonIcon } from '../icons';
import {
  alwaysVisibleResolver,
  isTextContainsBoldResolver,
  isTextContainsItalicResolver,
  isTextContainsUnderlineResolver,
  isTextContainsSpoilerResolver,
} from '../resolvers/tiptapResolvers';
import type { IToolbarItemConfigTiptap } from 'ricos-types';
export const tiptapStaticToolbarConfigDetachCommands: IToolbarItemConfigTiptap[] = [
  {
    id: 'bold',
    type: 'toggle',
    presentation: {
      tooltip: 'Bold',
      icon: BoldIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsBoldResolver,
    },
    commands: {
      toggleBold:
        ({ editorCommands }) =>
        () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          editorCommands.commands.toggleBold('');
        },
    },
  },
  {
    id: 'italic',
    type: 'toggle',
    presentation: {
      tooltip: 'Italic',
      icon: ItalicIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsItalicResolver,
    },
    commands: {
      toggleItalic:
        ({ editorCommands }) =>
        () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          editorCommands.commands.toggleItalic('');
        },
    },
  },
  {
    id: 'underline',
    type: 'toggle',
    presentation: {
      tooltip: 'Underline',
      icon: UnderlineIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsUnderlineResolver,
    },
    commands: {
      toggleUnderline:
        ({ editorCommands }) =>
        () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          editorCommands.commands.toggleUnderline('');
        },
    },
  },
  {
    id: 'textSpoiler',
    type: 'toggle',
    presentation: {
      tooltip: 'Spoiler',
      icon: SpoilerButtonIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsSpoilerResolver,
    },
    commands: {
      toggleSpoiler:
        ({ editorCommands }) =>
        () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          editorCommands.commands.toggleSpoiler('');
        },
    },
  },
];
