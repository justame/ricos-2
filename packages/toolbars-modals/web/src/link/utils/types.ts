import type { Anchorable_Blocks_Types } from './helpers';

export type TypesWithIndices = Partial<Record<AnchorableBlock['anchorType'], number>>;

export type AnchorableBlock =
  | AnchorableParagraph
  | AnchorableHeadingOne
  | AnchorableHeadingTwo
  | AnchorableHeadingThree
  | AnchorableHeadingFour
  | AnchorableHeadingFive
  | AnchorableHeadingSix
  | AnchorableBlockquote
  | AnchorableCodeBlock
  | AnchorableImage
  | AnchorableGallery
  | AnchorableGif
  | AnchorableVideo
  | AnchorableMap
  | AnchorableButton
  | AnchorableFile;

export type AnchorableBlockWithThumbnail =
  | AnchorableImage
  | AnchorableGallery
  | AnchorableGif
  | AnchorableVideo;

interface AnchorableParagraph {
  key: string;
  type: Anchorable_Blocks_Types.UNSTYLED;
  anchorType: Anchorable_Blocks_Types.UNSTYLED;
  text: string;
  index: number;
}

interface AnchorableHeadingOne {
  key: string;
  type: Anchorable_Blocks_Types.HEADER_ONE;
  anchorType: Anchorable_Blocks_Types.HEADER;
  text: string;
  index: number;
}

interface AnchorableHeadingTwo {
  key: string;
  type: Anchorable_Blocks_Types.HEADER_TWO;
  anchorType: Anchorable_Blocks_Types.HEADER;
  text: string;
  index: number;
}

interface AnchorableHeadingThree {
  key: string;
  type: Anchorable_Blocks_Types.HEADER_THREE;
  anchorType: Anchorable_Blocks_Types.HEADER;
  text: string;
  index: number;
}

interface AnchorableHeadingFour {
  key: string;
  type: Anchorable_Blocks_Types.HEADER_FOUR;
  anchorType: Anchorable_Blocks_Types.HEADER;
  text: string;
  index: number;
}

interface AnchorableHeadingFive {
  key: string;
  type: Anchorable_Blocks_Types.HEADER_FIVE;
  anchorType: Anchorable_Blocks_Types.HEADER;
  text: string;
  index: number;
}

interface AnchorableHeadingSix {
  key: string;
  type: Anchorable_Blocks_Types.HEADER_SIX;
  anchorType: Anchorable_Blocks_Types.HEADER;
  text: string;
  index: number;
}

interface AnchorableBlockquote {
  key: string;
  type: Anchorable_Blocks_Types.BLOCKQUOTE;
  anchorType: Anchorable_Blocks_Types.BLOCKQUOTE;
  text: string;
  index: number;
}

interface AnchorableCodeBlock {
  key: string;
  type: Anchorable_Blocks_Types.CODE_BLOCK;
  anchorType: Anchorable_Blocks_Types.CODE_BLOCK;
  text: string;
  index: number;
}

interface AnchorableImage {
  key: string;
  type: Anchorable_Blocks_Types.ATOMIC;
  anchorType: Anchorable_Blocks_Types.IMAGE;
  data: {
    src: {
      file_name: string;
    };
  };
  index: number;
}

interface AnchorableGallery {
  key: string;
  type: Anchorable_Blocks_Types.ATOMIC;
  anchorType: Anchorable_Blocks_Types.GALLERY;
  data: {
    items: [{ url: string }];
  };
  index: number;
}

interface AnchorableGif {
  key: string;
  type: Anchorable_Blocks_Types.ATOMIC;
  anchorType: Anchorable_Blocks_Types.GIF;
  data: {
    gif: { downsizedUrl: string };
  };
  index: number;
}

interface AnchorableVideo {
  key: string;
  type: Anchorable_Blocks_Types.ATOMIC;
  anchorType: Anchorable_Blocks_Types.VIDEO;
  data: {
    src: { thumbnail: { pathname: string } } | string;
  };
  index: number;
}

interface AnchorableMap {
  key: string;
  type: Anchorable_Blocks_Types.ATOMIC;
  anchorType: Anchorable_Blocks_Types.MAP;
  index: number;
}

interface AnchorableButton {
  key: string;
  type: Anchorable_Blocks_Types.ATOMIC;
  anchorType: Anchorable_Blocks_Types.BUTTON;
  index: number;
}

interface AnchorableFile {
  key: string;
  type: Anchorable_Blocks_Types.ATOMIC;
  anchorType: Anchorable_Blocks_Types.FILE;
  index: number;
}
