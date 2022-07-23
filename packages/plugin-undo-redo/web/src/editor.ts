import type { EditorPluginCreator } from 'wix-rich-content-common';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { createUndoRedoPlugin } from './createUndoRedoPlugin';
import { DEFAULTS } from './defaults';
import { undoRedo } from './tiptap/history';
import RedoIcon from './tiptap/RedoIcon';
import UndoIcon from './tiptap/UndoIcon';
import type { UndoRedoPluginEditorConfig } from './types';
import { UNDO_REDO_TYPE } from './types';

export const pluginUndoRedo: EditorPluginCreator<UndoRedoPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: UNDO_REDO_TYPE,
    createPlugin: createUndoRedoPlugin,
    ModalsMap: {},
    tiptapExtensions: [undoRedo],
    textButtons: [
      {
        id: 'undo',
        type: 'toggle',
        presentation: {
          dataHook: 'textInlineStyleButton_UNDO',
          tooltip: 'UndoButton_Tooltip',
          icon: UndoIcon,
        },
        attributes: {
          visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
          //TODO:
          // disabled: isUndoStackEmptyResolver,
        },
        commands: {
          redo: () => () => {},
          undo:
            ({ editorCommands }) =>
            () => {
              editorCommands.chain().focus().undo().run();
            },
        },
      },
      {
        id: 'redo',
        type: 'toggle',
        presentation: {
          dataHook: 'textInlineStyleButton_REDO',
          tooltip: 'RedoButton_Tooltip',
          icon: RedoIcon,
        },
        attributes: {
          visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
          //TODO:
          // disabled: isRedoStackEmptyResolver,
        },
        commands: {
          undo: () => () => {},
          redo:
            ({ editorCommands }) =>
            () => {
              editorCommands.chain().focus().redo().run();
            },
        },
      },
    ],
  };
};
