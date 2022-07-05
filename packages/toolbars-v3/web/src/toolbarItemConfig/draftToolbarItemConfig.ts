// import { ContentResolver } from './ContentResolver';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  BlockQuoteIcon,
  CodeBlockIcon,
  OrderedListIcon,
  UnorderedListIcon,
  SpoilerButtonIcon,
  increaseIndentPluginIcon,
  decreaseIndentPluginIcon,
  LineSpacingIcon,
  LinkIcon,
  TextColorIcon,
  TextHighlightIcon,
  UndoIcon,
  RedoIcon,
} from '../icons';

import {
  alwaysVisibleResolver,
  isTextContainsBoldResolver,
  isTextContainsItalicResolver,
  isTextContainsUnderlineResolver,
  isTextContainsQuoteResolver,
  isTextContainsCodeblockResolver,
  isTextContainsOrderedListResolver,
  isTextContainsUnorderedListResolver,
  isTextContainsSpoilerResolver,
  getAlignmentInSelectionResolver,
  getHeadingInSelectionResolver,
  getLineSpacingInSelectionResolver,
  getLineSpacingBeforeSelectionResolver,
  getLineSpacingAfterSelectionResolver,
  getFontSizeInSelectionResolver,
  isTextContainsLinkResolver,
  getTextColorInSelectionResolver,
  getHighlightColorInSelectionResolver,
  isUndoStackEmptyResolver,
  isRedoStackEmptyResolver,
} from '../resolvers/draftResolvers';
import type { IToolbarItemConfig } from '../types';

const MAX_FONT_SIZE = 900;
const MIN_FONT_SIZE = 1;

export const draftStaticToolbarConfig: IToolbarItemConfig[] = [
  {
    id: 'undo',
    type: 'toggle',
    presentation: {
      tooltip: 'Undo',
      icon: UndoIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      disabled: isUndoStackEmptyResolver,
    },
    commands: {
      undo:
        ({ editorCommands }) =>
        () => {
          editorCommands.commands.undo();
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'redo',
    type: 'toggle',
    presentation: {
      tooltip: 'Redo',
      icon: RedoIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      disabled: isRedoStackEmptyResolver,
    },
    commands: {
      redo:
        ({ editorCommands }) =>
        () => {
          editorCommands.commands.redo();
          editorCommands.commands.focus();
        },
    },
  },
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
          editorCommands.commands.toggleInlineStyle('bold');
          editorCommands.commands.focus();
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
          editorCommands.commands.toggleInlineStyle('italic');
          editorCommands.commands.focus();
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
          editorCommands.commands.toggleInlineStyle('underline');
          editorCommands.commands.focus();
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
    id: 'quote',
    type: 'toggle',
    presentation: {
      tooltip: 'Quote',
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
          editorCommands.commands.setBlockType('blockquote');
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'codeBlock',
    type: 'toggle',
    presentation: {
      tooltip: 'Code Block',
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
          editorCommands.commands.setBlockType('code-block');
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'orderedList',
    type: 'toggle',
    presentation: {
      tooltip: 'Ordered List',
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
          editorCommands.commands.setBlockType('ordered-list-item');
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'unorderedList',
    type: 'toggle',
    presentation: {
      tooltip: 'Unordered List',
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
          editorCommands.commands.setBlockType('unordered-list-item');
          editorCommands.commands.focus();
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
          editorCommands.commands.toggleInlineStyle('spoiler');
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'increaseIndent',
    type: 'toggle',
    presentation: {
      tooltip: 'Increase indent',
      icon: increaseIndentPluginIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
    },
    commands: {
      increaseIndent:
        ({ editorCommands }) =>
        () => {
          editorCommands.commands.insertDecoration('ricos-indent', 1);
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'decreaseIndent',
    type: 'toggle',
    presentation: {
      tooltip: 'Decrease indent',
      icon: decreaseIndentPluginIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
    },
    commands: {
      decreaseIndent:
        ({ editorCommands }) =>
        () => {
          editorCommands.commands.insertDecoration('ricos-indent', -1);
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'alignment',
    type: 'modal',
    presentation: {
      tooltip: 'Alignment',
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedAlignment: getAlignmentInSelectionResolver,
    },
    commands: {
      setAlignment:
        ({ editorCommands }) =>
        alignment => {
          editorCommands.commands.setTextAlignment(alignment);
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'title',
    type: 'toggle',
    presentation: {
      tooltip: 'Title',
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedHeading: getHeadingInSelectionResolver,
    },
    commands: {
      setHeading:
        ({ editorCommands }) =>
        heading => {
          editorCommands.commands.setBlockType(heading);
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'heading',
    type: 'modal',
    presentation: {
      tooltip: 'Heading',
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedHeading: getHeadingInSelectionResolver,
    },
    commands: {
      setHeading:
        ({ editorCommands }) =>
        heading => {
          editorCommands.commands.setBlockType(heading);
          editorCommands.commands.focus();
        },
      removeInlineStyles:
        ({ editorCommands }) =>
        (exclude?: string[]) => {
          editorCommands.commands.clearSelectedBlocksInlineStyles(exclude);
        },
    },
  },
  {
    id: 'customHeading',
    type: 'modal',
    presentation: {
      tooltip: 'Custom Heading',
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedHeading: getHeadingInSelectionResolver,
    },
    commands: {
      setHeading:
        ({ editorCommands }) =>
        heading => {
          editorCommands.commands.setBlockType(heading);
          editorCommands.commands.focus();
        },
      setAndSaveHeading:
        ({ editorCommands }) =>
        documentStyle => {
          editorCommands.commands.updateDocumentStyle(documentStyle);
          editorCommands.commands.focus();
        },
      removeInlineStyles:
        ({ editorCommands }) =>
        (exclude?: string[]) => {
          editorCommands.commands.clearSelectedBlocksInlineStyles(exclude);
        },
    },
  },
  {
    id: 'lineSpacing',
    type: 'modal',
    presentation: {
      tooltip: 'Line Spacing',
      icon: LineSpacingIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedLineSpacing: getLineSpacingInSelectionResolver,
      selectedLineSpacingBefore: getLineSpacingBeforeSelectionResolver,
      selectedLineSpacingAfter: getLineSpacingAfterSelectionResolver,
    },
    commands: {
      setLineSpacing:
        ({ editorCommands }) =>
        value => {
          if (!value) return;
          const data = { dynamicStyles: value };
          editorCommands.commands.insertDecoration('ricos-line-spacing', { ...data });
          editorCommands.commands.focus();
        },
      setLineSpacingWithoutFocus:
        ({ editorCommands }) =>
        value => {
          if (!value) return;
          const data = { dynamicStyles: value };
          editorCommands.commands.insertDecoration('ricos-line-spacing', { ...data });
        },
    },
  },
  {
    id: 'fontSize',
    type: 'modal',
    presentation: {
      tooltip: 'Font Size',
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
          const data = {
            fontSize: `${Math.min(Math.max(MIN_FONT_SIZE, value), MAX_FONT_SIZE)}`,
          };
          editorCommands.commands.insertDecoration('ricos-font-size', { ...data });
          editorCommands.commands.focus();
        },
      setFontSizeWithoutFocus:
        ({ editorCommands }) =>
        value => {
          if (!value) return;
          const data = {
            fontSize: `${Math.min(Math.max(MIN_FONT_SIZE, value), MAX_FONT_SIZE)}`,
          };
          editorCommands.commands.insertDecoration('ricos-font-size', { ...data });
        },
    },
  },
  {
    id: 'link',
    type: 'modal',
    presentation: {
      tooltip: 'Link',
      icon: LinkIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      active: isTextContainsLinkResolver,
    },
    commands: {
      insertLink:
        ({ editorCommands }) =>
        linkData => {
          editorCommands.commands.insertDecoration('ricos-link', linkData);
          editorCommands.commands.focus();
        },
      removeLink:
        ({ editorCommands }) =>
        () => {
          editorCommands.commands.deleteDecoration('ricos-link');
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'textColor',
    type: 'modal',
    presentation: {
      tooltip: 'Text Color',
      icon: TextColorIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedTextColor: getTextColorInSelectionResolver,
    },
    commands: {
      setTextColor:
        ({ editorCommands }) =>
        color => {
          editorCommands.commands.insertDecoration('ricos-text-color', color);
          editorCommands.commands.focus();
        },
      resetTextColor:
        ({ editorCommands }) =>
        () => {
          editorCommands.commands.insertDecoration('ricos-text-color');
          editorCommands.commands.focus();
        },
    },
  },
  {
    id: 'highlightColor',
    type: 'modal',
    presentation: {
      tooltip: 'Highlight Color',
      icon: TextHighlightIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedHighlightColor: getHighlightColorInSelectionResolver,
    },
    commands: {
      setHighlightColor:
        ({ editorCommands }) =>
        color => {
          editorCommands.commands.insertDecoration('ricos-text-highlight', color);
          editorCommands.commands.focus();
        },
      resetHighlightColor:
        ({ editorCommands }) =>
        () => {
          editorCommands.commands.insertDecoration('ricos-text-highlight');
          editorCommands.commands.focus();
        },
    },
  },
];
