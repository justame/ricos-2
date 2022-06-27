//TODO: understand
import type { EditorCommands } from 'wix-rich-content-common';
import type { ToolbarContextType } from 'ricos-context';
import type { TranslationFunction, IToolbarItem } from 'ricos-types';
import type { Styles } from 'ricos-styles';

type Modify<T, R> = Omit<T, keyof R> & R;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToolbarSpec = (attributes: Record<string, any>) => boolean;

type Command = ({
  attributes,
  editorCommands,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any;
  editorCommands: {
    commands: EditorCommands;
  };
}) => (...args) => void;

type TiptapCommand = ({
  attributes,
  editorCommands,
  styles,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any;

  // editorCommands: Editor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorCommands: any;
  styles?: Styles;
}) => (args) => void;

export type IToolbarItemConfig = Modify<
  IToolbarItem,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: Record<string, any>;
    // commands: Record<string, Command | TiptapCommand>;
    commands: Record<string, TiptapCommand>;
  }
>;

export type IToolbarItemConfigTiptap = Modify<
  IToolbarItem,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: Record<string, any>;
    commands: Record<string, TiptapCommand>;
  }
>;

export type ToolbarItemProps = {
  toolbarItem: IToolbarItem;
  onClick: (any) => void;
  context?: ToolbarContextType & { t: TranslationFunction };
  dataHook?: string;
};
