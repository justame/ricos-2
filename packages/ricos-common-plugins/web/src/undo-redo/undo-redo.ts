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
      name: 'undo',
      description: 'Undoes the last action',
      keys: { macOs: 'Meta+Z', windows: 'Ctrl+Z' },
      command(editorCommands: EditorCommands) {
        editorCommands.undo();
      },
      group: 'formatting',
      enabled: true,
    },
    {
      name: 'redo',
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
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.undo();
        return true;
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
      command: (editorCommands: EditorCommands) => () => {
        editorCommands.redo();
        return true;
      },
    },
  ],
};
