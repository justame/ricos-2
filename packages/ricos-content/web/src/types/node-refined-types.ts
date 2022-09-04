/*
 * This module introduces refined subtypes of loosely-typed proto based Node,
 * along with appropriate type guards for run time validation.
 * Currently, the schema validation relies on ts-proto generated fromJSON methods
 * that have bundle size impact and potentially modify data rather than validate it.
 */

import { Node_Type } from 'ricos-schema';
import type {
  Node,
  AppEmbedData,
  ButtonData,
  CodeBlockData,
  CollapsibleListData,
  DividerData,
  EmbedData,
  FileData,
  GalleryData,
  GIFData,
  HeadingData,
  HTMLData,
  ImageData,
  LinkPreviewData,
  MapData,
  ParagraphData,
  RichContent,
  TableCellData,
  TableData,
  TextData,
  VideoData,
  AudioData,
  PollData,
  OrderedListData,
  BulletedListData,
  BlockquoteData,
  NodeStyle,
} from 'ricos-schema';
import { isTextData, isParagraphData } from './node-data-refined-types';

type Identified = {
  id: Node['id'];
};

type Styled = { style?: NodeStyle };

const isIdentified = (node: Node): boolean => typeof node.id === 'string' && node.id.length > 0;

// RichText
export type RichText = {
  nodes: RichTextNode[];
  metadata?: RichContent['metadata'];
};

export type RichTextNode = ParagraphNode | HeadingNode | CodeBlockNode | BlockquoteNode;

type TextNodeContainer = Identified &
  Styled & {
    nodes: TextNode[];
  };

const isTextNodeContainer = (node: Node): boolean => node.nodes.every(isTextNode);

export type TextNode = Leaf & {
  textData: TextData;
  type: Node_Type.TEXT;
  id: '';
};

export const isTextNode = (node: Node): node is TextNode =>
  isLeaf(node) && isTextData(node.textData) && node.type === Node_Type.TEXT && node.id === '';

export type ParagraphNode = TextNodeContainer & {
  paragraphData: ParagraphData;
  type: Node_Type.PARAGRAPH;
};

export const isParagraphNode = (node: Node): node is ParagraphNode =>
  isIdentified(node) &&
  isParagraphData(node.paragraphData) &&
  node.type === Node_Type.PARAGRAPH &&
  isTextNodeContainer(node);

export type HeadingNode = TextNodeContainer & {
  headingData: HeadingData;
  type: Node_Type.HEADING;
};

export type CodeBlockNode = TextNodeContainer & {
  codeBlockData: CodeBlockData;
  type: Node_Type.CODE_BLOCK;
};

export type BlockquoteNode = Identified &
  Styled & {
    type: Node_Type.BLOCKQUOTE;
    nodes: ParagraphNode[]; // until editor is based on draft
    blockquoteData: BlockquoteData;
  };

// Lists
export type ListItemNode = Identified &
  Styled & {
    type: Node_Type.LIST_ITEM;
    nodes: ParagraphNode[]; // until editor is based on draft
  };

export type ListNode = OrderedListNode | BulletedListNode;

export type OrderedListNode = Identified &
  Styled & {
    type: Node_Type.ORDERED_LIST;
    nodes: ListItemNode[];
    orderedListData: OrderedListData;
  };

export type BulletedListNode = Identified &
  Styled & {
    type: Node_Type.BULLETED_LIST;
    nodes: ListItemNode[];
    bulletedListData: BulletedListData;
  };

// TODO: refactor name
export type RichContentNodeWithContainerData =
  | CollapsibleListNode
  | TableNode
  | AppEmbedNode
  | ButtonNode
  | DividerNode
  | EmbedNode
  | FileNode
  | GalleryNode
  | GifNode
  | HtmlNode
  | ImageNode
  | LinkPreviewNode
  | MapNode
  | VideoNode
  | AudioNode
  | PollNode;

// Top-level nodes
export type RichContentNode = RichTextNode | ListNode | RichContentNodeWithContainerData;

// RichContent Containers
type RichContainer = {
  nodes: RichContentNode[];
};

export type CollapsibleListNode = Identified &
  Styled & {
    type: Node_Type.COLLAPSIBLE_LIST;
    nodes: CollapsibleItemNode[];
    collapsibleListData: CollapsibleListData;
  };

export type CollapsibleItemNode = Identified &
  Styled & {
    type: Node_Type.COLLAPSIBLE_ITEM;
    nodes: [CollapsibleItemTitleNode, CollapsibleItemBodyNode];
  };

export type CollapsibleItemTitleNode = Identified &
  Styled & {
    type: Node_Type.COLLAPSIBLE_ITEM_TITLE;
    nodes: RichTextNode[];
  };

export type CollapsibleItemBodyNode = Identified &
  Styled &
  RichContainer & {
    type: Node_Type.COLLAPSIBLE_ITEM_BODY;
  };

// Table
export type TableNode = Identified &
  Styled & {
    type: Node_Type.TABLE;
    nodes: TableRowNode[];
    tableData: TableData;
  };

export type TableRowNode = Identified &
  Styled & {
    type: Node_Type.TABLE_ROW;
    nodes: TableCellNode[];
  };

export type TableCellNode = Identified &
  Styled &
  RichContainer & {
    type: Node_Type.TABLE_CELL;
    tableCellData: TableCellData;
  };

// Atomic
type Leaf = Omit<Node, 'nodes'> & {
  nodes: never[];
};

const isLeaf = (node: Node): node is Leaf => node.nodes === [];

export type DividerNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.DIVIDER;
    dividerData: DividerData;
  };

export type ButtonNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.BUTTON;
    buttonData: ButtonData;
  };

export type FileNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.FILE;
    fileData: FileData;
  };

export type GalleryNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.GALLERY;
    galleryData: GalleryData;
  };

export type GifNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.GIF;
    gifData: GIFData;
  };

export type HtmlNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.HTML;
    htmlData: HTMLData;
  };

export type ImageNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.IMAGE;
    imageData: ImageData;
  };

export type LinkPreviewNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.LINK_PREVIEW;
    linkPreviewData: LinkPreviewData;
  };

export type MapNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.MAP;
    mapData: MapData;
  };

export type AppEmbedNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.APP_EMBED;
    appEmbedData: AppEmbedData;
  };

export type EmbedNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.EMBED;
    embedData: EmbedData;
  };

export type VideoNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.VIDEO;
    videoData: VideoData;
  };

export type AudioNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.AUDIO;
    audioData: AudioData;
  };

export type PollNode = Identified &
  Styled &
  Leaf & {
    type: Node_Type.POLL;
    pollData: PollData;
  };

export type RefinedNode =
  | RichContentNode
  | TextNode
  | ListItemNode
  | CollapsibleItemNode
  | CollapsibleItemBodyNode
  | CollapsibleItemTitleNode
  | TableCellNode
  | TableRowNode;
