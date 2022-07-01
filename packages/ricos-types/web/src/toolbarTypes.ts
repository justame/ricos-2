import type { Node as TiptapNode } from 'prosemirror-model';

export type IToolbarItem = {
  id: string;
  type:
    | 'textColorIndicator'
    | 'toggle'
    | 'font'
    | 'imageSettings'
    | 'textType'
    | 'modal'
    | 'separator';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  presentation?: Record<string, any>;
  attributes: Record<string, string | boolean | number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: Record<string, (...args: any) => void>;
};

export interface IContentResolver<T> {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (content: T) => any;
}

export interface TiptapContentResolver {
  create: (
    id: string,
    resolve: IContentResolver<TiptapNode[]>['resolve']
  ) => IContentResolver<TiptapNode[]>;
}

type Modify<T, R> = Omit<T, keyof R> & R;

export type TiptapCommand = ({
  attributes,
  editorCommands,
  styles,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any;

  // editorCommands: Editor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorCommands: any;
  styles?;
}) => (args) => void;

export type IToolbarItemConfigTiptap = Modify<
  IToolbarItem,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: Record<string, any>;
    commands: Record<string, TiptapCommand>;
  }
>;
