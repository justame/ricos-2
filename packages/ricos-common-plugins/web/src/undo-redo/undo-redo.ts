import type { EditorCommands, TiptapEditorPlugin } from 'wix-rich-content-common';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';
import { undoRedo } from './history';
import RedoIcon from './RedoIcon';
import UndoIcon from './UndoIcon';

export const pluginUndoRedo: TiptapEditorPlugin = {
  config: {},
  type: 'undo-redo',
  tiptapExtensions: [undoRedo],
  shortcuts: [
    {
      name: 'UNDO',
      description: 'Undoes the last action',
      keys: { macOs: 'Meta+Z', windows: 'Ctrl+Z' },
      command(editorCommands: EditorCommands) {
        editorCommands.undo();
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'REDO',
      description: 'Redoes the last action',
      keys: { macOs: 'Meta+Shift+Z', windows: 'Ctrl+Shift+Z' },
      command(editorCommands: EditorCommands) {
        editorCommands.redo();
      },
      group: 'formatting',
      enabled: true,
    },
  ],
  textButtons: [
    {
      id: 'UNDO',
      type: 'toggle',
      presentation: {
        dataHook: 'textInlineStyleButton_UNDO',
        tooltip: 'UndoButton_Tooltip',
        icon: UndoIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        disabled: RESOLVERS_IDS.IS_UNDO_STACK_EMPTY,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.undo();
        return true;
      },
    },
    {
      id: 'REDO',
      type: 'toggle',
      presentation: {
        dataHook: 'textInlineStyleButton_REDO',
        tooltip: 'RedoButton_Tooltip',
        icon: RedoIcon,
      },
      attributes: {
        visible: RESOLVERS_IDS.ALWAYS_VISIBLE,
        disabled: RESOLVERS_IDS.IS_REDO_STACK_EMPTY,
      },
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.redo();
        return true;
      },
    },
  ],
};
