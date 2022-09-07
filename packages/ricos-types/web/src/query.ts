import type { Node, Decoration, Decoration_Type, TextStyle } from 'ricos-schema';
// import type { Node as ProseNode } from 'prosemirror-model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryItem = (...args) => any;
export type QueryItemCreator = ({ editorQuery }: { editorQuery: IEditorQuery }) => QueryItem;
// eslint-disable-next-line @typescript-eslint/ban-types
export type QueryItems = {};

export interface IQuery {
  query: Record<string, QueryItem>;
  addQuery: (name: string, query: QueryItem) => void;
}

export interface IStylesQuery {
  getTextBlockDecoration(
    node: ITreeNodeQuery,
    decorationType: Decoration_Type
  ): Decoration | undefined;
  getTextDecoration: (
    node: ITreeNodeQuery,
    decorationType: Decoration_Type
  ) => Decoration | undefined;
  getTextBlockStyle: (node: ITreeNodeQuery) => Partial<TextStyle> | undefined;
  getComputedDecoration(
    node: ITreeNodeQuery,
    decorationType: Decoration_Type
  ): Decoration | undefined;

  getComputedTextStyle(node: ITreeNodeQuery, textStyleName: string): Partial<TextStyle> | undefined;
}

export interface ISelection {
  isEmpty: boolean;
  doc: ITreeNodeQuery;
  collapsedDecorations: Decoration[];
}

export interface IEditorStateQuery {
  storedDecorations(): Decoration[];
}
export interface IEditorQuery {
  selection(): ISelection;
  state(): IEditorStateQuery;
  styles(): IStylesQuery;
  query: Record<string, QueryItem>;
  addQuery: (name: string, query: QueryItem) => void;
}

// consturcotr EditorQuery
export interface SelectionQuery {}

export interface ITreeNodeQuery<T = Node> {
  children: ITreeNodeQuery[];
  parent: ITreeNodeQuery | null;

  descendants(predicate: (node: ITreeNodeQuery) => boolean): ITreeNodeQuery[];

  closest(predicate: (node: ITreeNodeQuery) => boolean): ITreeNodeQuery | null;

  isTextBlock(): boolean;

  isBlock(): boolean;

  isText(): boolean;

  type(): string;

  toNode(): T;

  originalIndex: number;
}
