import type { Editor } from '@tiptap/react';

export const applyDevTools = (editor: Editor, isDebugMode = false) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (/debug/i.test(window.location.search) || isDebugMode) {
    import(
      /* webpackChunkName: "prosemirror-dev-tools" */
      'prosemirror-dev-tools'
    ).then(({ applyDevTools }) => {
      applyDevTools(editor.view);
    });
  }
};
