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
  // LineSpacingIcon,
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
  isTextContainsLinkResolver,
  getTextColorInSelectionResolver,
  getHighlightColorInSelectionResolver,
} from '../resolvers/tiptapResolvers';
import type { IToolbarItemConfigTiptap } from '../types';

const MAX_FONT_SIZE = 900;
const MIN_FONT_SIZE = 1;

export const tiptapStaticToolbarConfig: IToolbarItemConfigTiptap[] = [
  {
    id: 'undo',
    type: 'toggle',
    presentation: {
      tooltip: 'Undo',
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
      tooltip: 'Redo',
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
      tooltip: 'Bold',
      icon: BoldIcon,
    },
    attributes: {
      visible: isOnlyTextSelected,
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
          editorCommands.chain().focus().toggleItalic().run();
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
          editorCommands.chain().focus().toggleBlockquote().run();
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
          editorCommands.chain().focus().toggleCodeBlock().run();
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
          editorCommands.chain().focus().toggleOrderedList().run();
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
          editorCommands.chain().focus().toggleBulletList().run();
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
          editorCommands.chain().focus().toggleSpoiler().run();
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
          // eslint-disable-next-line no-console
          console.log('TODO: increaseIndent');
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
          // eslint-disable-next-line no-console
          console.log('TODO: decreaseIndent');
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
          editorCommands.chain().focus().setTextAlign(alignment).run();
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
      removeInlineStyles:
        ({ editorCommands }) =>
        (exclude?: string[]) => {
          // eslint-disable-next-line no-console
          console.log('TODO: removeInlineStyles');
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
  // {
  //   id: 'lineSpacing',
  //   type: 'modal',
  //   presentation: {
  //     tooltip: 'Line Spacing',
  //     icon: LineSpacingIcon,
  //   },
  //   attributes: {
  //     visible: alwaysVisibleResolver,
  //     selectedLineSpacing: getLineSpacingInSelectionResolver,
  //     selectedLineSpacingBefore: getLineSpacingBeforeSelectionResolver,
  //     selectedLineSpacingAfter: getLineSpacingAfterSelectionResolver,
  //   },
  //   commands: {
  //     setLineSpacing:
  //       ({ editorCommands }) =>
  //       value => {
  //         if (!value) return;
  //         const data = { dynamicStyles: value };
  //         editorCommands.commands.insertDecoration('ricos-line-spacing', { ...data });
  //         editorCommands.commands.focus();
  //       },
  //     setLineSpacingWithoutFocus:
  //       ({ editorCommands }) =>
  //       value => {
  //         if (!value) return;
  //         const data = { dynamicStyles: value };
  //         editorCommands.commands.insertDecoration('ricos-line-spacing', { ...data });
  //       },
  //   },
  // },
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
          editorCommands
            .chain()
            .focus()
            .setLink({ link: { ...linkData } })
            .run();
        },
      removeLink:
        ({ editorCommands }) =>
        () => {
          editorCommands.chain().focus().unsetLink().run();
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
