import type { EditorCommands } from './editorCommandsType';
import type { TiptapAdapter } from './tiptap';

export interface IRicosEditor {
  getEditorCommands(): EditorCommands;
  readonly adapter: TiptapAdapter;
}

export interface EditorEventSource {
  publishLoaded(): boolean;
  publishFirstEdit(): boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publishError(error: any, errorInfo: any): boolean;
  publishContentSaved(): boolean;
}

export interface UploadObserver {
  initializeUploadObserver(): void;
  finalizeUploadObserver(): void;
  hasActiveUploads(): boolean;
}
