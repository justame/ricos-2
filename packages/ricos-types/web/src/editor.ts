import type { EditorCommands } from './editorCommandsType';
import type { TiptapAdapter } from './tiptap';

export interface IRicosEditor {
  getEditorCommands(): EditorCommands;
  readonly adapter: TiptapAdapter;
}
