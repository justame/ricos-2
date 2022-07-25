import type {
  Decoration_Type,
  AnchorData,
  ColorData,
  FontSizeData,
  LinkData,
  MentionData,
} from 'ricos-schema';

export type AnchorDecoration = {
  type: Decoration_Type.ANCHOR;
  anchorData: AnchorData;
};

export type BoldDecoration = {
  type: Decoration_Type.BOLD;
  fontWeightValue: number;
};

export type ColorDecoration = {
  type: Decoration_Type.COLOR;
  colorData: ColorData;
};

export type ExternalDecoration = {
  type: Decoration_Type.EXTERNAL;
};

export type FontSizeDecoration = {
  type: Decoration_Type.FONT_SIZE;
  fontSizeData: FontSizeData;
};

export type ItalicDecoration = {
  type: Decoration_Type.ITALIC;
  italicData: boolean;
};

export type LinkDecoration = {
  type: Decoration_Type.LINK;
  linkData: LinkData;
};

export type MentionDecoration = {
  type: Decoration_Type.MENTION;
  mentionData: MentionData;
};

export type SpoilerDecoration = {
  type: Decoration_Type.SPOILER;
};

export type UnderlineDecoration = {
  type: Decoration_Type.UNDERLINE;
  underlineData: boolean;
};
