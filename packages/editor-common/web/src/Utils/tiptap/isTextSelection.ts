import type { Selection } from 'prosemirror-state';

// replacing isTextSelection of tiptap which is broken
// https://github.com/ueberdosis/tiptap/issues/2979
export const isTextSelection = (selection: Selection): boolean =>
  selection.toJSON().type === 'text';
