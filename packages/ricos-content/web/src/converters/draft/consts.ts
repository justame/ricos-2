import {
  MENTION_TYPE,
  LINK_TYPE,
  IMAGE_TYPE,
  DIVIDER_TYPE,
  FILE_UPLOAD_TYPE,
  GALLERY_TYPE,
  GIPHY_TYPE,
  HTML_TYPE,
  LINK_PREVIEW_TYPE,
  MAP_TYPE,
  POLL_TYPE,
  VIDEO_TYPE,
  AUDIO_TYPE,
  APP_EMBED_TYPE,
  LINK_BUTTON_TYPE,
  ACTION_BUTTON_TYPE,
  IMAGE_TYPE_LEGACY,
  SPOILER_TYPE,
  COLLAPSIBLE_LIST_TYPE,
  VIDEO_TYPE_LEGACY,
  TABLE_TYPE,
  ANCHOR_TYPE,
  EMBED_TYPE,
  RICOS_NODE_TYPE_TO_DATA_FIELD,
  EXTERNAL,
  RICOS_DIVIDER_TYPE,
  RICOS_LINK_TYPE,
  RICOS_TEXT_COLOR_TYPE,
  RICOS_TEXT_HIGHLIGHT_TYPE,
  RICOS_FILE_TYPE,
  RICOS_GALLERY_TYPE,
  RICOS_GIPHY_TYPE,
  RICOS_HASHTAG_TYPE,
  RICOS_HTML_TYPE,
  RICOS_CODE_BLOCK_TYPE,
  RICOS_IMAGE_TYPE,
  RICOS_VIDEO_TYPE,
  RICOS_EMOJI_TYPE,
  VERTICAL_EMBED_TYPE,
  TEXT_COLOR_TYPE,
  TEXT_HIGHLIGHT_TYPE,
  RICOS_UNDO_REDO_TYPE,
  RICOS_SPOILER_TYPE,
  RICOS_INDENT_TYPE,
  RICOS_LINE_SPACING_TYPE,
  RICOS_POLL_TYPE,
  RICOS_MENTION_TYPE,
  RICOS_COLLAPSIBLE_LIST_TYPE,
  EMOJI_TYPE,
  INDENT_TYPE,
  HEADINGS_DROPDOWN_TYPE,
  RICOS_MAP_TYPE,
  RICOS_VERTICAL_EMBED_TYPE,
  EXTERNAL_LINK_TYPE,
  UNDO_REDO_TYPE,
  HASHTAG_TYPE,
  LINE_SPACING_TYPE,
  CODE_BLOCK_TYPE,
  HEADERS_MARKDOWN_TYPE,
  RICOS_HEADINGS_DROPDOWN_TYPE,
  RICOS_LINK_BUTTON_TYPE,
  RICOS_LINK_PREVIEW_TYPE,
  RICOS_EXTERNAL_LINK_TYPE,
  RICOS_TABLE_TYPE,
  RICOS_ACTION_BUTTON_TYPE,
  RICOS_HEADERS_MARKDOWN_TYPE,
} from '../../consts';
import { Decoration_Type, Node_Type } from 'ricos-schema';
import { fromEntries } from '../../utils';

export enum BlockType {
  Unstyled = 'unstyled',
  HeaderOne = 'header-one',
  HeaderTwo = 'header-two',
  HeaderThree = 'header-three',
  HeaderFour = 'header-four',
  HeaderFive = 'header-five',
  HeaderSix = 'header-six',
  UnorderedListItem = 'unordered-list-item',
  OrderedListItem = 'ordered-list-item',
  Blockquote = 'blockquote',
  CodeBlock = 'code-block',
  Atomic = 'atomic',
}

export enum HeaderLevel {
  'header-one' = 1,
  'header-two' = 2,
  'header-three' = 3,
  'header-four' = 4,
  'header-five' = 5,
  'header-six' = 6,
}

export const FROM_DRAFT_LIST_TYPE = {
  [BlockType.UnorderedListItem]: Node_Type.BULLETED_LIST,
  [BlockType.OrderedListItem]: Node_Type.ORDERED_LIST,
};

export const TO_DRAFT_LIST_TYPE = fromEntries(
  Object.entries(FROM_DRAFT_LIST_TYPE).map(([key, value]) => [value, key])
);

export const TO_RICOS_NODE_TYPE = {
  [LINK_BUTTON_TYPE]: Node_Type.BUTTON,
  [ACTION_BUTTON_TYPE]: Node_Type.BUTTON,
  [DIVIDER_TYPE]: Node_Type.DIVIDER,
  [FILE_UPLOAD_TYPE]: Node_Type.FILE,
  [GALLERY_TYPE]: Node_Type.GALLERY,
  [GIPHY_TYPE]: Node_Type.GIF,
  [HTML_TYPE]: Node_Type.HTML,
  [IMAGE_TYPE]: Node_Type.IMAGE,
  [IMAGE_TYPE_LEGACY]: Node_Type.IMAGE,
  [COLLAPSIBLE_LIST_TYPE]: Node_Type.COLLAPSIBLE_LIST,
  [LINK_PREVIEW_TYPE]: Node_Type.LINK_PREVIEW,
  [MAP_TYPE]: Node_Type.MAP,
  [APP_EMBED_TYPE]: Node_Type.APP_EMBED,
  [VIDEO_TYPE]: Node_Type.VIDEO,
  [AUDIO_TYPE]: Node_Type.AUDIO,
  [VIDEO_TYPE_LEGACY]: Node_Type.VIDEO,
  [POLL_TYPE]: Node_Type.POLL,
  [TABLE_TYPE]: Node_Type.TABLE,
  [EMBED_TYPE]: Node_Type.EMBED,
  [EXTERNAL]: Node_Type.EXTERNAL,
};

const DUPLICATE_KEYS = [IMAGE_TYPE_LEGACY, VIDEO_TYPE_LEGACY];

// Node_Type.IMAGE: IMAGE_TYPE
export const FROM_RICOS_ENTITY_TYPE = fromEntries(
  Object.entries(TO_RICOS_NODE_TYPE)
    .filter(([key]) => !DUPLICATE_KEYS.includes(key))
    .map(([key, value]) => [value, key])
);

export const TO_RICOS_DECORATION_TYPE = {
  BOLD: Decoration_Type.BOLD,
  ITALIC: Decoration_Type.ITALIC,
  UNDERLINE: Decoration_Type.UNDERLINE,
  [SPOILER_TYPE]: Decoration_Type.SPOILER,
  [ANCHOR_TYPE]: Decoration_Type.ANCHOR,
  [MENTION_TYPE]: Decoration_Type.MENTION,
  [LINK_TYPE]: Decoration_Type.LINK,
  [EXTERNAL]: Decoration_Type.EXTERNAL,
};

export const TO_RICOS_INLINE_STYLE_TYPE = {
  BOLD: { type: Decoration_Type.BOLD, fontWeightValue: 700 },
  NOT_BOLD: { type: Decoration_Type.BOLD, fontWeightValue: 400 },
  ITALIC: { type: Decoration_Type.ITALIC, italicData: true },
  NOT_ITALIC: { type: Decoration_Type.ITALIC, italicData: false },
  UNDERLINE: { type: Decoration_Type.UNDERLINE, underlineData: true },
  NOT_UNDERLINE: { type: Decoration_Type.UNDERLINE, underlineData: false },
};

export const TO_RICOS_PLUGIN_TYPE = {
  ...TO_RICOS_NODE_TYPE,
  ...TO_RICOS_DECORATION_TYPE,
};

// Decoration_Type.BOLD: BOLD
export const FROM_RICOS_DECORATION_TYPE = fromEntries(
  Object.entries(TO_RICOS_DECORATION_TYPE).map(([key, value]) => [value, key])
);

export const ENTITY_DECORATION_TO_MUTABILITY = {
  [ANCHOR_TYPE]: 'MUTABLE',
  [LINK_TYPE]: 'MUTABLE',
  [MENTION_TYPE]: 'SEGMENTED',
  EMOJI_TYPE: 'IMMUTABLE',
};

export const DRAFT_BLOCK_TYPE_TO_DATA_FIELD = {
  [BlockType.Unstyled]: 'paragraphData',
  [BlockType.UnorderedListItem]: 'paragraphData',
  [BlockType.OrderedListItem]: 'paragraphData',
  [BlockType.HeaderOne]: 'headingData',
  [BlockType.HeaderTwo]: 'headingData',
  [BlockType.HeaderThree]: 'headingData',
  [BlockType.HeaderFour]: 'headingData',
  [BlockType.HeaderFive]: 'headingData',
  [BlockType.HeaderSix]: 'headingData',
  [BlockType.CodeBlock]: 'codeBlockData',
  [BlockType.Blockquote]: 'paragraphData',
};

// IMAGE_TYPE: imageData
const DRAFT_PLUGIN_TYPE_TO_DATA_FIELD = fromEntries(
  Object.entries(TO_RICOS_NODE_TYPE).map(([key, value]) => [
    key,
    RICOS_NODE_TYPE_TO_DATA_FIELD[value],
  ])
);

export const ENTITY_DECORATION_TO_DATA_FIELD = {
  [ANCHOR_TYPE]: 'anchorData',
  [LINK_TYPE]: 'linkData',
  [MENTION_TYPE]: 'mentionData',
  EMOJI_TYPE: 'emojiData',
};

const DECORATION_TO_DATA_FIELD = {
  COLOR: 'colorData',
  FONT_SIZE: 'fontSizeData',
};

export const TO_RICOS_DECORATION_DATA_FIELD = {
  ...ENTITY_DECORATION_TO_DATA_FIELD,
  ...DECORATION_TO_DATA_FIELD,
};

export const TO_RICOS_DATA_FIELD = {
  ...TO_RICOS_DECORATION_DATA_FIELD,
  ...DRAFT_PLUGIN_TYPE_TO_DATA_FIELD,
  ...DRAFT_BLOCK_TYPE_TO_DATA_FIELD,
};

export type DraftGalleryStyles = {
  galleryLayout?: number;
  gallerySizePx?: number;
  oneRow?: boolean;
  cubeRatio?: number;
  isVertical?: boolean;
  numberOfImagesPerRow?: number;
  m_numberOfImagesPerRow?: number;
  cubeType?: string;
  galleryThumbnailsAlignment?: string;
  imageMargin?: number;
  thumbnailSpacings?: number;
};

export const TO_DRAFT_PLUGIN_TYPE_MAP = {
  [RICOS_DIVIDER_TYPE]: DIVIDER_TYPE,
  [RICOS_FILE_TYPE]: FILE_UPLOAD_TYPE,
  [RICOS_GALLERY_TYPE]: GALLERY_TYPE,
  [RICOS_GIPHY_TYPE]: GIPHY_TYPE,
  [RICOS_HTML_TYPE]: HTML_TYPE,
  [RICOS_IMAGE_TYPE]: IMAGE_TYPE,
  [RICOS_VIDEO_TYPE]: VIDEO_TYPE,
  [RICOS_POLL_TYPE]: POLL_TYPE,
  [RICOS_LINK_TYPE]: LINK_TYPE,
  [RICOS_MENTION_TYPE]: MENTION_TYPE,
  [RICOS_TEXT_HIGHLIGHT_TYPE]: TEXT_HIGHLIGHT_TYPE,
  [RICOS_TEXT_COLOR_TYPE]: TEXT_COLOR_TYPE,
  [DIVIDER_TYPE]: DIVIDER_TYPE,
  [FILE_UPLOAD_TYPE]: FILE_UPLOAD_TYPE,
  [GALLERY_TYPE]: GALLERY_TYPE,
  [GIPHY_TYPE]: GIPHY_TYPE,
  [HTML_TYPE]: HTML_TYPE,
  [IMAGE_TYPE]: IMAGE_TYPE,
  [VIDEO_TYPE]: VIDEO_TYPE,
  [AUDIO_TYPE]: AUDIO_TYPE,
  [POLL_TYPE]: POLL_TYPE,
  [TEXT_HIGHLIGHT_TYPE]: TEXT_HIGHLIGHT_TYPE,
  [TEXT_COLOR_TYPE]: TEXT_COLOR_TYPE,
  [RICOS_INDENT_TYPE]: RICOS_INDENT_TYPE,
  [RICOS_LINE_SPACING_TYPE]: RICOS_LINE_SPACING_TYPE,
  [EXTERNAL]: EXTERNAL,
  [LINK_BUTTON_TYPE]: LINK_BUTTON_TYPE,
  [ACTION_BUTTON_TYPE]: ACTION_BUTTON_TYPE,
  [RICOS_LINK_BUTTON_TYPE]: LINK_BUTTON_TYPE,
  [RICOS_ACTION_BUTTON_TYPE]: ACTION_BUTTON_TYPE,
  [MAP_TYPE]: MAP_TYPE,
  [RICOS_COLLAPSIBLE_LIST_TYPE]: COLLAPSIBLE_LIST_TYPE,
  [COLLAPSIBLE_LIST_TYPE]: COLLAPSIBLE_LIST_TYPE,
  [VERTICAL_EMBED_TYPE]: VERTICAL_EMBED_TYPE,
  [EMBED_TYPE]: EMBED_TYPE,
  [CODE_BLOCK_TYPE]: RICOS_CODE_BLOCK_TYPE,
  [RICOS_LINK_PREVIEW_TYPE]: LINK_PREVIEW_TYPE,
};

export const TO_RICOS_PLUGIN_TYPE_MAP = {
  [DIVIDER_TYPE]: RICOS_DIVIDER_TYPE,
  [FILE_UPLOAD_TYPE]: RICOS_FILE_TYPE,
  [GALLERY_TYPE]: RICOS_GALLERY_TYPE,
  [GIPHY_TYPE]: RICOS_GIPHY_TYPE,
  [HTML_TYPE]: RICOS_HTML_TYPE,
  [IMAGE_TYPE]: RICOS_IMAGE_TYPE,
  [VIDEO_TYPE]: RICOS_VIDEO_TYPE,
  [AUDIO_TYPE]: AUDIO_TYPE,
  [POLL_TYPE]: RICOS_POLL_TYPE,
  [LINK_TYPE]: RICOS_LINK_TYPE,
  [MENTION_TYPE]: RICOS_MENTION_TYPE,
  [COLLAPSIBLE_LIST_TYPE]: RICOS_COLLAPSIBLE_LIST_TYPE,
  [ACTION_BUTTON_TYPE]: RICOS_ACTION_BUTTON_TYPE,
  [LINK_BUTTON_TYPE]: RICOS_LINK_BUTTON_TYPE,
  [CODE_BLOCK_TYPE]: RICOS_CODE_BLOCK_TYPE,
  [EMOJI_TYPE]: RICOS_EMOJI_TYPE,
  [HASHTAG_TYPE]: RICOS_HASHTAG_TYPE,
  [HEADERS_MARKDOWN_TYPE]: RICOS_HEADERS_MARKDOWN_TYPE,
  [INDENT_TYPE]: RICOS_INDENT_TYPE,
  [LINE_SPACING_TYPE]: RICOS_LINE_SPACING_TYPE,
  [TABLE_TYPE]: RICOS_TABLE_TYPE,
  [EXTERNAL_LINK_TYPE]: RICOS_EXTERNAL_LINK_TYPE,
  [LINK_PREVIEW_TYPE]: RICOS_LINK_PREVIEW_TYPE,
  [SPOILER_TYPE]: RICOS_SPOILER_TYPE,
  [UNDO_REDO_TYPE]: RICOS_UNDO_REDO_TYPE,
  [HEADINGS_DROPDOWN_TYPE]: RICOS_HEADINGS_DROPDOWN_TYPE,
  [MAP_TYPE]: RICOS_MAP_TYPE,
  [TEXT_COLOR_TYPE]: RICOS_TEXT_COLOR_TYPE,
  [TEXT_HIGHLIGHT_TYPE]: RICOS_TEXT_HIGHLIGHT_TYPE,
  [VERTICAL_EMBED_TYPE]: RICOS_VERTICAL_EMBED_TYPE,
  [RICOS_COLLAPSIBLE_LIST_TYPE]: RICOS_COLLAPSIBLE_LIST_TYPE,
  [COLLAPSIBLE_LIST_TYPE]: RICOS_COLLAPSIBLE_LIST_TYPE,
};

export { RICOS_NODE_TYPE_TO_DATA_FIELD }; // exists here to avoid breaking API
