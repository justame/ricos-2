import type { JSONContent } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';
import type { Node } from 'prosemirror-model';
import type { FunctionComponent } from 'react';
import React, { useEffect, useContext } from 'react';
import { getLangDir, isSSR } from 'wix-rich-content-common';
import { tiptapToDraft } from 'ricos-converters';
import { RicosTiptapContext } from '../../context';
import { RicosContext } from 'ricos-context';
import { useForceUpdate } from '../../lib/useForceUpdate';
import styles from '../../statics/styles/tiptap-editor-styles.scss';
import type { RicosTiptapEditorProps } from '../../types';
import cx from 'classnames';

// TODO: maybe should move it to utils ?
const getSelectedNodes = ({ editor }) => {
  const selection = editor.state.selection;
  const nodes: Node[] = [];
  editor.state.doc.nodesBetween(selection.from, selection.to, (node: Node) => {
    nodes.push(node);
  });

  return nodes;
};

export const RicosTiptapEditor: FunctionComponent<RicosTiptapEditorProps> = ({
  editor,
  onUpdate,
  onSelectionUpdate,
  editorStyleClasses,
  htmlAttributes,
  onLoad,
  ...context
}) => {
  const forceUpdate = useForceUpdate();
  const { experiments, locale } = useContext(RicosContext);

  useEffect(() => {
    editor.on('update', ({ editor }) => {
      onUpdate?.({
        content: tiptapToDraft(
          editor.getJSON() as JSONContent,
          experiments.removeRichContentSchemaNormalizer?.enabled
        ),
      });
    });
    editor.on('selectionUpdate', ({ editor }) => {
      const selectedNodes = getSelectedNodes({ editor });
      onSelectionUpdate?.({
        selectedNodes,
        content: tiptapToDraft(
          editor.getJSON() as JSONContent,
          experiments.removeRichContentSchemaNormalizer?.enabled
        ),
      });
    });
    editor.on('transaction', forceUpdate);
    if (!isSSR()) {
      //@ts-ignore
      window.ricosEditor = editor;
    }
    onLoad && editor.on('create', onLoad);
  }, []);

  const { containerClassName, editorClassName } = editorStyleClasses || {};

  return (
    <RicosTiptapContext.Provider
      value={{
        context: {
          ...context,
        },
      }}
    >
      <div
        data-hook="ricos-tiptap-editor"
        dir={getLangDir(locale)}
        className={cx(containerClassName, styles.ricosTiptapEditor)}
        {...htmlAttributes}
      >
        <EditorContent editor={editor} className={editorClassName} />
      </div>
    </RicosTiptapContext.Provider>
  );
};
