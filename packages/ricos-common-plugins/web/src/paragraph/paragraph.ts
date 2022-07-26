import { UNSTYLED } from 'ricos-content';
import { Node_Type } from 'ricos-schema';
import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { paragraph } from './extension';

export const pluginParagraph: TiptapEditorPlugin = {
  type: Node_Type.PARAGRAPH,
  shortcuts: [
    {
      name: 'paragraph',
      description: 'Toggles paragraph to current node',
      keys: { macOs: 'Meta+Alt+0', windows: 'Ctrl+Alt+0' },
      command(editorCommands: EditorCommands) {
        editorCommands.setBlockType(UNSTYLED);
      },
      group: 'formatting',
      enabled: true,
    },
  ],
  config: {},
  tiptapExtensions: [paragraph],
};
