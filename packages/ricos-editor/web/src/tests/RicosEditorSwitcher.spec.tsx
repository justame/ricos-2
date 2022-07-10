import type { RefObject } from 'react';
import React, { createRef } from 'react';
import type { RicosEditorType, RicosEditorProps } from '../index';
import { RicosEditor } from '../index';
import content from '../../../../../e2e/tests/fixtures/intro.json';
import { wait } from '@testing-library/dom';
import { mount } from 'enzyme';

const mountEditor = (
  isTiptap: boolean,
  ref?: RefObject<RicosEditorType>,
  props?: RicosEditorProps
) => {
  const { experiments, ...rest } = props || {};
  const newProps = {
    ...rest,
    experiments: { ...experiments, tiptapEditor: { enabled: isTiptap } },
  };
  return mount(<RicosEditor {...newProps} ref={ref} />);
};

const getEditorRef = (isTiptap: boolean, props?: RicosEditorProps) => {
  const ref = createRef<RicosEditorType>();
  mountEditor(isTiptap, ref, { ...props });
  return ref;
};

const getDraftRef = (props?: RicosEditorProps) => getEditorRef(false, props);

const getTiptapRef = (props?: RicosEditorProps) => getEditorRef(true, props);

describe('RicosEditorSwitcher', () => {
  describe('Draft', () => {
    it('should have all editor ref API', async () => {
      const editorRef = getDraftRef({ content });
      await wait();
      expect(editorRef.current?.blur).toBeTruthy();
      expect(editorRef.current?.focus).toBeTruthy();
      expect(editorRef.current?.getContent).toBeTruthy();
      expect(editorRef.current?.getContentPromise).toBeTruthy();
      expect(editorRef.current?.getContentTraits).toBeTruthy();
      expect(editorRef.current?.getToolbarProps).toBeTruthy();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((editorRef.current as any)?.editor.editor.handlePastedText).toBeTruthy();
      expect(editorRef.current?.getEditorCommands).toBeTruthy();
    });
  });

  describe('Tiptap', () => {
    it('should have all editor ref API', async () => {
      const editorRef = getTiptapRef({ content });
      await wait();
      expect(editorRef.current?.blur).toBeTruthy();
      expect(editorRef.current?.focus).toBeTruthy();
      expect(editorRef.current?.getContent).toBeTruthy();
      expect(editorRef.current?.getContentPromise).toBeTruthy();
      expect(editorRef.current?.getContentTraits).toBeTruthy();
      expect(editorRef.current?.getToolbarProps).toBeTruthy();
      expect(editorRef.current?.getEditorCommands).toBeTruthy();
    });
  });
});
