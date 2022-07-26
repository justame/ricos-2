import type { Node as TiptapNode } from 'prosemirror-model';
import type { EditorCommands } from './editorCommandsType';
import type { ModalConfig } from './modalTypes';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: Record<string, (...args: any) => void>;
};

export interface IContentResolver<T> {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (content: T, services?: any) => any;
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
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any;

  // editorCommands: Editor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorCommands: any;
}) => (args) => void;

export type IToolbarItemConfigTiptap = Modify<
  IToolbarItem,
  {
    // TODO: use RESOLVERS_IDS type instead of string
    attributes: Record<string, IContentResolver<TiptapNode[]>>;
    commands: Record<string, TiptapCommand>;
  }
>;

export type FormattingToolbarButtonConfig = Modify<
  IToolbarItemConfigTiptap,
  {
    attributes: Record<string, string>;
    commands?: Record<string, TiptapCommand>;
    command?: (editorCommands: EditorCommands) => boolean;
    modal?: ModalConfig;
  }
>;
