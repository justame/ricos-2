import type { Decoration } from 'ricos-schema';
import type { Editor } from '@tiptap/core';
import type { IEditorStateQuery } from 'ricos-types';
import { markToDecorations } from './utils';

export class EditorStateQuery implements IEditorStateQuery {
  // eslint-disable-next-line no-useless-constructor
  constructor(private editor: Editor) {}

  storedDecorations(): Decoration[] {
    return markToDecorations(this.editor.schema, this.editor.state.storedMarks);
  }
}
