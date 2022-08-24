import { RESOLVERS_IDS } from './resolvers/resolvers-ids';
import {
  alwaysVisibleResolver,
  getAlignmentInSelectionResolver,
  getFontSizeInSelectionResolver,
  getHeadingInSelectionResolver,
  getHighlightColorInSelectionResolver,
  getLineSpacingAfterSelectionResolver,
  getLineSpacingBeforeSelectionResolver,
  getLineSpacingInSelectionResolver,
  getTextColorInSelectionResolver,
  isTextContainsAnchorResolver,
  isTextContainsBoldResolver,
  isTextContainsCodeblockResolver,
  isTextContainsItalicResolver,
  isTextContainsLinkOrAnchorResolver,
  isTextContainsLinkResolver,
  isTextContainsOrderedListResolver,
  isTextContainsQuoteResolver,
  isTextContainsSpoilerResolver,
  isTextContainsUnderlineResolver,
  isTextContainsUnorderedListResolver,
  isTextInSelection,
  isTextStylesMatchDocumentStylesResolver,
  isUndoStackEmptyResolver,
  isRedoStackEmptyResolver,
} from './resolvers/tiptapResolvers';

export const resolversById = {
  [RESOLVERS_IDS.ALWAYS_VISIBLE]: alwaysVisibleResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_ANCHOR]: isTextContainsAnchorResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_BOLD]: isTextContainsBoldResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_CODE_BLOCK]: isTextContainsCodeblockResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_ITALIC]: isTextContainsItalicResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_LINK]: isTextContainsLinkResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_LINK_OR_ANCHOR]: isTextContainsLinkOrAnchorResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_ORDERED_LIST]: isTextContainsOrderedListResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_QUOTE]: isTextContainsQuoteResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_UNDERLINE]: isTextContainsUnderlineResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_UNORDERED_LIST]: isTextContainsUnorderedListResolver,
  [RESOLVERS_IDS.IS_TEXT_IN_SELECTION]: isTextInSelection,
  [RESOLVERS_IDS.GET_HEADING_IN_SELECTION]: getHeadingInSelectionResolver,
  [RESOLVERS_IDS.GET_HIGHLIGHT_COLOR_IN_SELECTION]: getHighlightColorInSelectionResolver,
  [RESOLVERS_IDS.GET_TEXT_COLOR_IN_SELECTION]: getTextColorInSelectionResolver,
  [RESOLVERS_IDS.GET_LINE_SPACING_IN_SELECTION]: getLineSpacingInSelectionResolver,
  [RESOLVERS_IDS.GET_LINE_SPACING_BEFORE_SELECTION]: getLineSpacingBeforeSelectionResolver,
  [RESOLVERS_IDS.GET_LINE_SPACING_AFTER_SELECTION]: getLineSpacingAfterSelectionResolver,
  [RESOLVERS_IDS.GET_ALIGNMENT_IN_SELECTION]: getAlignmentInSelectionResolver,
  [RESOLVERS_IDS.GET_FONT_SIZE_IN_SELECTION]: getFontSizeInSelectionResolver,
  [RESOLVERS_IDS.IS_TEXT_CONTAINS_SPOILER]: isTextContainsSpoilerResolver,
  [RESOLVERS_IDS.IS_TEXT_STYLES_MATCH_DOCUMENT_STYLES]: isTextStylesMatchDocumentStylesResolver,
  [RESOLVERS_IDS.IS_UNDO_STACK_EMPTY]: isUndoStackEmptyResolver,
  [RESOLVERS_IDS.IS_REDO_STACK_EMPTY]: isRedoStackEmptyResolver,
};

export { tiptapStaticToolbarConfig } from './toolbarItemConfig/tiptapToolbarItemConfig';
export { linkToolbarItemConfig } from './toolbarItemConfig/linkToolbarItemConfig';

export const toolbarsV3 = () => {
  // eslint-disable-next-line no-console
  console.log('toolbarsV3');
  return 'toolbarsV3';
};

export { default as RicosTiptapToolbar } from './components/RicosTiptapToolbar';
export { Content } from './Content';
export { FloatingToolbar } from './components/FloatingToolbar/FloatingToolbar';
export { TiptapContentResolver } from './ContentResolver';
export * from './resolvers/tiptapResolvers';
export { ToggleButton } from './components/buttons';
export { default as RicosToolbarComponent } from './components/RicosToolbarComponent';
export { default as FloatingAddPluginMenu } from './modals/FloatingPluginMenu/FloatingAddPluginMenu';
export { NodeLinkButton } from './components/buttons';
export { default as InsertPluginToolbar } from './components/InsertPluginToolbar/InsertPluginToolbar';
export { RicosToolbars } from './ricos-toolbars';
