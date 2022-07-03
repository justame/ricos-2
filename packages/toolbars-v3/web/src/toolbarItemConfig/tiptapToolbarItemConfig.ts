import { createLink } from 'ricos-content/libs/nodeUtils';
import { convertRelObjectToString, convertRelStringToObject } from 'wix-rich-content-common';
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
  isOnlyTextSelected,
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
  getFontSizeInSelectionResolver,
  isTextContainsLinkOrAnchorResolver,
  getTextColorInSelectionResolver,
  getHighlightColorInSelectionResolver,
  getLineSpacingInSelectionResolver,
  getLineSpacingBeforeSelectionResolver,
  getLineSpacingAfterSelectionResolver,
} from '../resolvers/tiptapResolvers';
import type { IToolbarItemConfigTiptap } from 'ricos-types';

const MAX_FONT_SIZE = 900;
const MIN_FONT_SIZE = 1;

export const tiptapStaticToolbarConfig: IToolbarItemConfigTiptap[] = [
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
        ({ editorCommands, styles }) =>
        () => {
          editorCommands.chain().focus().toggleBold(styles).run();
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
        ({ editorCommands, styles }) =>
        () => {
          editorCommands.chain().focus().toggleItalic(styles).run();
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
    id: 'spoiler',
    type: 'toggle',
    presentation: {
      dataHook: 'textSpoilerButton',
      tooltip: 'Spoiler_Insert_Tooltip',
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
          editorCommands.chain().focus().toggleSpoiler().run();
        },
    },
  },
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
    id: 'title',
    type: 'toggle',
    presentation: {
      dataHook: 'textBlockStyleButton_Title',
      tooltip: 'TitleButton_Tooltip',
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedHeading: getHeadingInSelectionResolver,
    },
    commands: {
      setHeading:
        ({ editorCommands }) =>
        heading => {
          if (heading === 'unstyled') {
            editorCommands.chain().focus().setParagraph().run();
          } else {
            const headingMap = {
              'header-one': 1,
              'header-two': 2,
              'header-three': 3,
              'header-four': 4,
              'header-five': 5,
              'header-six': 6,
            };
            const headingLevel = headingMap[heading];
            editorCommands.chain().focus().toggleHeading({ level: headingLevel }).run();
          }
        },
    },
  },
  {
    id: 'headings',
    type: 'modal',
    presentation: {
      dataHook: 'headingsDropdownButton',
      tooltip: 'FormattingToolbar_TextStyleButton_Tooltip',
    },
    attributes: {
      visible: alwaysVisibleResolver,
      selectedHeading: getHeadingInSelectionResolver,
    },
    commands: {
      setHeading:
        ({ editorCommands }) =>
        heading => {
          if (heading === 'unstyled') {
            editorCommands.chain().focus().setParagraph().run();
          } else {
            const headingMap = {
              'header-one': 1,
              'header-two': 2,
              'header-three': 3,
              'header-four': 4,
              'header-five': 5,
              'header-six': 6,
            };
            const headingLevel = headingMap[heading];
            editorCommands.chain().focus().toggleHeading({ level: headingLevel }).run();
          }
        },
      setAndSaveHeading:
        ({ editorCommands }) =>
        documentStyle => {
          // eslint-disable-next-line no-console
          console.log('TODO: setAndSaveHeading');
        },
      removeInlineStyles:
        ({ editorCommands }) =>
        (exclude?: string[]) => {
          // eslint-disable-next-line no-console
          console.log('TODO: removeInlineStyles');
        },
    },
  },
  {
    id: 'lineSpacing',
    type: 'modal',
    presentation: {
      dataHook: 'LineSpacingButton',
      tooltip: 'LineSpacingButton_Tooltip',
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
          const {
            'line-height': stringLineHeight,
            'padding-bottom': stringPaddingBottom,
            'padding-top': stringPaddingTop,
          } = value;

          const lineHeight = parseFloat(stringLineHeight);
          const paddingBottom = parseFloat(stringPaddingBottom);
          const paddingTop = parseFloat(stringPaddingTop);

          editorCommands
            .chain()
            .focus()
            .setLineSpacing(lineHeight)
            .setLineSpacingBefore(paddingTop)
            .setLineSpacingAfter(paddingBottom)
            .run();
        },
      setLineSpacingWithoutFocus:
        ({ editorCommands }) =>
        value => {
          if (!value) return;
          const {
            'line-height': stringLineHeight,
            'padding-bottom': stringPaddingBottom,
            'padding-top': stringPaddingTop,
          } = value;

          const lineHeight = parseFloat(stringLineHeight);
          const paddingBottom = parseFloat(stringPaddingBottom);
          const paddingTop = parseFloat(stringPaddingTop);

          editorCommands
            .chain()
            .setLineSpacing(lineHeight)
            .setLineSpacingBefore(paddingTop)
            .setLineSpacingAfter(paddingBottom)
            .run();
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
        anchor => {
          editorCommands.chain().focus().setAnchor(anchor).run();
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
  {
    id: 'textColor',
    type: 'modal',
    presentation: {
      dataHook: 'TextColorButton',
      tooltip: 'TextColorButton_Tooltip',
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
          editorCommands.chain().focus().setColor(color.color).run();
        },
      resetTextColor:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().unsetColor().run();
        },
    },
  },
  {
    id: 'textHighlight',
    type: 'modal',
    presentation: {
      dataHook: 'TextHighlightButton',
      tooltip: 'TextHighlightButton_Tooltip',
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
          editorCommands.chain().focus().setHighlight(color.color).run();
        },
      resetHighlightColor:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().unsetHighlight().run();
        },
    },
  },
];
