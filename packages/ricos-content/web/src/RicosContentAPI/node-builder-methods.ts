import type {
  ButtonData,
  CodeBlockData,
  DividerData,
  HeadingData,
  HTMLData,
  MapData,
  Node,
  ParagraphData,
  PluginContainerData,
  RichContent,
  TextData,
  PollData,
} from 'ricos-schema';
import {
  ButtonData_Type,
  DividerData_Alignment,
  DividerData_LineStyle,
  DividerData_Width,
  MapType,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
  TextStyle_TextAlignment,
  PollData_Poll_Settings_Permissions_ViewRole,
  PollData_Poll_Settings_Permissions_VoteRole,
  PollData_Layout_PollLayout_Type,
  PollData_Layout_PollLayout_Direction,
  PollData_Design_PollDesign_Background_Type,
  HTMLData_Source,
} from 'ricos-schema';
import { dataByNodeType } from '../converters/nodeUtils';
import type { BuilderFunctionsMetadata, ListItemData } from '../types/contentApi';
import type {
  ListItemNode,
  ListNode,
  ParagraphNode,
  RichTextNode,
} from '../types/node-refined-types';
import { addNode as add, toListDataArray, toTextDataArray } from './builder-utils';

export type AddMethodParams<TData> = {
  data: TData;
  index?: number;
  before?: string;
  after?: string;
  content: RichContent;
  type: Node_Type;
};

export type AddTextMethodParams<T> = AddMethodParams<T> & {
  text?: string | TextData | (string | TextData)[];
  type: RichTextNode['type'];
};

export type AddListMethodParams = {
  items: string | TextData | ListItemData | (string | TextData | ListItemData)[];
  data?: ParagraphData;
  type: ListNode['type'];
  index?: number;
  before?: string;
  after?: string;
  content: RichContent;
};

export const DEFAULT_PARAGRAPH_DATA: ParagraphData = {
  textStyle: { textAlignment: TextStyle_TextAlignment.AUTO },
  indentation: 0,
};

export const DEFAULT_CONTAINER_DATA: PluginContainerData = {
  alignment: PluginContainerData_Alignment.CENTER,
  textWrap: true,
  width: { size: PluginContainerData_Width_Type.CONTENT },
};

export const DEFAULT_DIVIDER_DATA: DividerData = {
  lineStyle: DividerData_LineStyle.SINGLE,
  width: DividerData_Width.LARGE,
  alignment: DividerData_Alignment.CENTER,
  containerData: { ...DEFAULT_CONTAINER_DATA, textWrap: false },
};

export const DEFAULT_BUTTON_DATA: ButtonData = {
  type: ButtonData_Type.ACTION,
  containerData: DEFAULT_CONTAINER_DATA,
  text: 'Click Me',
};

export const DEFAULT_CODE_DATA: CodeBlockData = {
  textStyle: {
    textAlignment: TextStyle_TextAlignment.AUTO,
  },
};

export const DEFAULT_HEADING_DATA: HeadingData = {
  level: 2,
  indentation: 0,
  textStyle: { textAlignment: TextStyle_TextAlignment.AUTO },
};

export const DEFAULT_MAP_DATA: MapData = {
  containerData: DEFAULT_CONTAINER_DATA,
  mapSettings: {
    mapType: MapType.ROADMAP,
  },
};

export const DEFAULT_HTML_DATA: HTMLData = {
  containerData: DEFAULT_CONTAINER_DATA,
  html: '<div/>',
  url: undefined,
  source: HTMLData_Source.HTML,
};

export const DEFAULT_POLL_DATA: PollData = {
  containerData: DEFAULT_CONTAINER_DATA,
  poll: {
    options: [],
    title: '',
    settings: {
      permissions: {
        view: PollData_Poll_Settings_Permissions_ViewRole.VOTERS,
        vote: PollData_Poll_Settings_Permissions_VoteRole.SITE_MEMBERS,
        allowMultipleVotes: false,
      },
      showVoters: true,
      showVotesCount: true,
    },
  },
  layout: {
    poll: {
      type: PollData_Layout_PollLayout_Type.LIST,
      direction: PollData_Layout_PollLayout_Direction.LTR,
      enableImage: false,
    },
    options: {
      enableImage: false,
    },
  },
  design: {
    poll: {
      background: {
        type: PollData_Design_PollDesign_Background_Type.IMAGE,
      },
      borderRadius: 0,
    },
    options: {
      borderRadius: 0,
    },
  },
};

export const createNode =
  <T = Node, NT = Node[]>(generateId: () => string) =>
  (type: Node_Type, data: unknown, nodes?: NT): T => ({
    id: generateId(),
    type,
    ...dataByNodeType(type, data),
    nodes: nodes || [],
  });

export const createListNode =
  <T extends ListNode>(generateId: () => string) =>
  (type: ListNode['type'], items: ListItemData[]): T =>
    createNode<T, ListItemNode[]>(generateId)(
      type,
      {},
      items.map(({ text, data }) =>
        createNode<ListItemNode, ParagraphNode[]>(generateId)(Node_Type.LIST_ITEM, {}, [
          createTextNode<ParagraphNode>(generateId)(Node_Type.PARAGRAPH, text, data),
        ])
      )
    );

export const createTextNode =
  <T extends RichTextNode>(generateId: () => string) =>
  (type: RichTextNode['type'], text: TextData[], data: unknown): T => ({
    ...createNode<T>(generateId)(type, data),
    nodes: text.map(textData => ({
      nodes: [],
      id: '',
      type: Node_Type.TEXT,
      ...dataByNodeType(Node_Type.TEXT, textData),
    })),
  });

export const makeNode =
  (generateId: () => string) =>
  <TData>({ data, type }: Omit<AddMethodParams<TData>, BuilderFunctionsMetadata>): Node =>
    createNode(generateId)(type, data);

export const addNode =
  (generateId: () => string) =>
  <TData>({ data, type, index, before, after, content }: AddMethodParams<TData>): RichContent => {
    const node: Node = makeNode(generateId)({ type, data });
    return add({ node: node as Node, index, before, after, content });
  };

export const makeTextNode =
  (generateId: () => string) =>
  <TData>({
    text,
    data,
    type,
  }: Omit<AddTextMethodParams<TData>, BuilderFunctionsMetadata>): Node => {
    const textData = toTextDataArray(text);
    return createTextNode(generateId)(type, textData, data);
  };

export const addTextNode =
  (generateId: () => string) =>
  <TData>({
    text,
    data,
    type,
    index,
    before,
    after,
    content,
  }: AddTextMethodParams<TData>): RichContent => {
    const node = makeTextNode(generateId)({ text, data, type });
    return add({ node: node as Node, index, before, after, content });
  };

export const makeListNode =
  (generateId: () => string) =>
  ({
    items,
    data = DEFAULT_PARAGRAPH_DATA,
    type,
  }: Omit<AddListMethodParams, BuilderFunctionsMetadata>): Node => {
    const listItemData = toListDataArray(items, data);
    return createListNode(generateId)(type, listItemData);
  };

export const addListNode =
  (generateId: () => string) =>
  ({ items, data, type, index, before, after, content }: AddListMethodParams): RichContent => {
    const node = makeListNode(generateId)({ items, data, type });
    return add({ node: node as Node, index, before, after, content });
  };
