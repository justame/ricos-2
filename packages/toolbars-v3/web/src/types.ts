//TODO: understand
import type { EditorCommands } from 'wix-rich-content-common';
import type { Editor } from '@tiptap/core';
import type { ToolbarContextType } from 'ricos-context';
import type { TranslationFunction } from 'ricos-types';
import type { TiptapContentResolver } from './ContentResolver';
import type { PLUGIN_TOOLBAR_BUTTON_ID } from 'wix-rich-content-editor-common';
import type { Styles } from 'ricos-styles';

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

type PluginButtonId = typeof PLUGIN_TOOLBAR_BUTTON_ID[keyof typeof PLUGIN_TOOLBAR_BUTTON_ID];

export type IPluginToolbarButtonsConfig = Record<PluginButtonId, IToolbarItemConfigTiptap>;

export type ToolbarItemProps = {
  toolbarItem: IToolbarItem;
  onClick: (any) => void;
  context?: ToolbarContextType & { t: TranslationFunction };
  dataHook?: string;
};
