import { Node_Type } from 'ricos-schema';
import type { Node } from 'ricos-schema';

export const enum Anchorable_Blocks_Types {
  ATOMIC = 'atomic',
  UNSTYLED = 'unstyled',
  HEADER = 'header',
  HEADER_ONE = 'header-one',
  HEADER_TWO = 'header-two',
  HEADER_THREE = 'header-three',
  HEADER_FOUR = 'header-four',
  HEADER_FIVE = 'header-five',
  HEADER_SIX = 'header-six',
  BLOCKQUOTE = 'blockquote',
  CODE_BLOCK = 'code-block',
  IMAGE = 'wix-draft-plugin-image',
  GALLERY = 'wix-draft-plugin-gallery',
  GIF = 'wix-draft-plugin-giphy',
  VIDEO = 'wix-draft-plugin-video',
  MAP = 'wix-draft-plugin-map',
  BUTTON = 'buttons',
  FILE = 'wix-draft-plugin-file-upload',
}

export const isAnchorableAtomicPluginNode = (node: Node): boolean => {
  const { type } = node;
  return (
    type === Node_Type.IMAGE ||
    type === Node_Type.GALLERY ||
    type === Node_Type.VIDEO ||
    type === Node_Type.MAP ||
    type === Node_Type.BUTTON ||
    // type === ACTION_BUTTON_TYPE ||
    type === Node_Type.GIF ||
    type === Node_Type.FILE
  );
};

export const isAnchorableTextNode = (node: Node): boolean => {
  const { type } = node;
  return (
    type === Node_Type.PARAGRAPH ||
    type === Node_Type.BLOCKQUOTE ||
    type === Node_Type.CODE_BLOCK ||
    // type === Node_Type.ORDERED_LIST ||
    // type === Node_Type.BULLETED_LIST ||
    type === Node_Type.HEADING
  );
};

export const isThumbnailNode = (node: Node): boolean => {
  const { type } = node;
  return (
    type === Node_Type.IMAGE ||
    type === Node_Type.GALLERY ||
    type === Node_Type.VIDEO ||
    type === Node_Type.GIF
  );
};

export const textNodesMapper = {
  [Node_Type.PARAGRAPH]: Anchorable_Blocks_Types.UNSTYLED,
  [Node_Type.BLOCKQUOTE]: Anchorable_Blocks_Types.BLOCKQUOTE,
  [Node_Type.CODE_BLOCK]: Anchorable_Blocks_Types.CODE_BLOCK,
  [Node_Type.HEADING]: Anchorable_Blocks_Types.HEADER,
};

export const headersMapper = {
  1: Anchorable_Blocks_Types.HEADER_ONE,
  2: Anchorable_Blocks_Types.HEADER_TWO,
  3: Anchorable_Blocks_Types.HEADER_THREE,
  4: Anchorable_Blocks_Types.HEADER_FOUR,
  5: Anchorable_Blocks_Types.HEADER_FIVE,
  6: Anchorable_Blocks_Types.HEADER_SIX,
};

export const atomicNodesMapper = {
  [Node_Type.IMAGE]: Anchorable_Blocks_Types.IMAGE,
  [Node_Type.GALLERY]: Anchorable_Blocks_Types.GALLERY,
  [Node_Type.VIDEO]: Anchorable_Blocks_Types.VIDEO,
  [Node_Type.MAP]: Anchorable_Blocks_Types.MAP,
  [Node_Type.BUTTON]: Anchorable_Blocks_Types.BUTTON,
  [Node_Type.GIF]: Anchorable_Blocks_Types.GIF,
  [Node_Type.FILE]: Anchorable_Blocks_Types.FILE,
};
