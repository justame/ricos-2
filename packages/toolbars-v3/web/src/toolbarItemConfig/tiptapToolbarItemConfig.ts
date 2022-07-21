import { createLink } from 'ricos-content/libs/nodeUtils';
import { convertRelObjectToString, convertRelStringToObject } from 'wix-rich-content-common';
// import { ContentResolver } from './ContentResolver';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  BlockQuoteIcon,
  OrderedListIcon,
  UnorderedListIcon,
  LinkIcon,
  UndoIcon,
  RedoIcon,
  PlusIcon,
} from '../icons';
import {
  alwaysVisibleResolver,
  isTextContainsBoldResolver,
  isTextContainsItalicResolver,
  isTextContainsUnderlineResolver,
  isTextContainsQuoteResolver,
  isTextContainsOrderedListResolver,
  isTextContainsUnorderedListResolver,
  getAlignmentInSelectionResolver,
  getFontSizeInSelectionResolver,
  isTextContainsLinkOrAnchorResolver,
} from '../resolvers/tiptapResolvers';
import type { IToolbarItemConfigTiptap } from 'ricos-types';

const MAX_FONT_SIZE = 900;
const MIN_FONT_SIZE = 1;

export const tiptapStaticToolbarConfig: IToolbarItemConfigTiptap[] = [
  {
    id: 'addPlugin',
    type: 'modal',
    presentation: {
      icon: PlusIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
    },
    commands: {},
  },
  {
    id: 'undo',
    type: 'toggle',
    presentation: {
      dataHook: 'textInlineStyleButton_UNDO',
      tooltip: 'UndoButton_Tooltip',
      icon: UndoIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      //TODO:
      // disabled: isUndoStackEmptyResolver,
    },
    commands: {
      undo:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().undo().run();
        },
    },
  },
  {
    id: 'redo',
    type: 'toggle',
    presentation: {
      dataHook: 'textInlineStyleButton_REDO',
      tooltip: 'RedoButton_Tooltip',
      icon: RedoIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      //TODO:
      // disabled: isRedoStackEmptyResolver,
    },
    commands: {
      redo:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().redo().run();
        },
    },
  },
  {
    id: 'bold',
    type: 'toggle',
    presentation: {
      dataHook: 'textInlineStyleButton_Bold',
      tooltip: 'BoldButton_Tooltip',
      tooltipShortcut: {
        MacOS: ' (⌘B)',
        Windows: ' (Ctrl+B)',
      },
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
          editorCommands.chain().focus().toggleBold().run();
        },
    },
  },
  {
    id: 'italic',
    type: 'toggle',
    presentation: {
      dataHook: 'textInlineStyleButton_Italic',
      tooltip: 'ItalicButton_Tooltip',
      tooltipShortcut: {
        MacOS: ' (⌘I)',
        Windows: ' (Ctrl+I)',
      },
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
          editorCommands.chain().focus().toggleItalic().run();
        },
    },
  },
  {
    id: 'underline',
    type: 'toggle',
    presentation: {
      dataHook: 'textInlineStyleButton_Underline',
      tooltip: 'UnderlineButton_Tooltip',
      tooltipShortcut: {
        MacOS: ' (⌘U)',
        Windows: ' (Ctrl+U)',
      },
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
          editorCommands.chain().focus().toggleUnderline().run();
        },
    },
  },
  {
    id: 'separator',
    type: 'separator',
    presentation: {},
    attributes: {
      visible: alwaysVisibleResolver,
    },
    commands: {},
  },
  {
    id: 'blockquote',
    type: 'toggle',
    presentation: {
      dataHook: 'textBlockStyleButton_Quote',
      tooltip: 'QuoteButton_Tooltip',
      icon: BlockQuoteIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsQuoteResolver,
    },
    commands: {
      toggleQuote:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().toggleBlockquote().run();
        },
    },
  },
  {
    id: 'orderedList',
    type: 'toggle',
    presentation: {
      dataHook: 'textBlockStyleButton_Numberedlist',
      tooltip: 'OrderedListButton_Tooltip',
      icon: OrderedListIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsOrderedListResolver,
    },
    commands: {
      toggleOrderedList:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().toggleOrderedList().run();
        },
    },
  },
  {
    id: 'unorderedList',
    type: 'toggle',
    presentation: {
      dataHook: 'textBlockStyleButton_Bulletedlist',
      tooltip: 'UnorderedListButton_Tooltip',
      icon: UnorderedListIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsUnorderedListResolver,
    },
    commands: {
      toggleUnorderedList:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().toggleBulletList().run();
        },
    },
  },
  {
    id: 'alignment',
    type: 'modal',
    presentation: {
      dataHook: 'textDropDownButton_Alignment',
      tooltip: 'AlignTextDropdownButton_Tooltip',
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedAlignment: getAlignmentInSelectionResolver,
    },
    commands: {
      setAlignment:
        ({ editorCommands }) =>
        alignment => {
          editorCommands.chain().focus().setTextAlign(alignment).run();
        },
    },
  },
  {
    id: 'fontSize',
    type: 'modal',
    presentation: {
      dataHook: 'customFontSizeButton',
      tooltip: 'FormattingToolbar_CustomFontSizeButton_Tooltip',
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedFontSize: getFontSizeInSelectionResolver,
    },
    commands: {
      setFontSize:
        ({ editorCommands }) =>
        value => {
          if (!value) return;
          const fontSize = Math.min(Math.max(MIN_FONT_SIZE, value), MAX_FONT_SIZE);
          editorCommands.chain().focus().setFontSize(fontSize).run();
        },
      setFontSizeWithoutFocus:
        ({ editorCommands }) =>
        value => {
          if (!value) return;
          const fontSize = Math.min(Math.max(MIN_FONT_SIZE, value), MAX_FONT_SIZE);
          editorCommands.chain().setFontSize(fontSize).run();
        },
    },
  },
  {
    id: 'link',
    type: 'modal',
    presentation: {
      dataHook: 'LinkButton',
      tooltip: 'TextLinkButton_Tooltip',
      icon: LinkIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsLinkOrAnchorResolver,
    },
    commands: {
      insertLink:
        ({ editorCommands }) =>
        linkData => {
          const { rel, target, url } = linkData;
          const relValue = convertRelObjectToString(convertRelStringToObject(rel));
          const link = createLink({ url, rel: relValue, target });
          editorCommands.chain().focus().setLink({ link }).run();
        },
      insertAnchor:
        ({ editorCommands }) =>
        data => {
          editorCommands.chain().focus().setAnchor(data).run();
        },
      removeLink:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().unsetLink().run();
        },
      removeAnchor:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().unsetAnchor().run();
        },
    },
  },
];
