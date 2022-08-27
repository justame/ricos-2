import type { Node, Decoration, Decoration_Type, TextStyle } from 'ricos-schema';
// import type { Node as ProseNode } from 'prosemirror-model';

export type QueryItem = (
  editorQuery: IEditorQuery,
  selection: ISelection,
  stylesQuery: IStylesQuery
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;

export interface IQuery {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  core: Record<string, (...args) => any>;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coreQuery: Record<string, (...args) => any>;
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

  byIndex(index: number): ITreeNodeQuery | null;

  type(): string;

  toNode(): T;

  originalIndex: number;
}
