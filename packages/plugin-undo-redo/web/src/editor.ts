import type { EditorPluginCreator } from 'wix-rich-content-common';
import { createUndoRedoPlugin } from './createUndoRedoPlugin';
import { DEFAULTS } from './defaults';
import type { UndoRedoPluginEditorConfig } from './types';
import { UNDO_REDO_TYPE } from './types';

export const pluginUndoRedo: EditorPluginCreator<UndoRedoPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: UNDO_REDO_TYPE,
    createPlugin: createUndoRedoPlugin,
    ModalsMap: {},
  };
};
