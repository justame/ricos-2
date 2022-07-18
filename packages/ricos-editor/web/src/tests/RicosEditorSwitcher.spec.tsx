import { wait } from '@testing-library/dom';
import { mount } from 'enzyme';
import type { RefObject } from 'react';
import React, { createRef } from 'react';
import content from '../../../../../e2e/tests/fixtures/intro.json';
import type { RicosEditorProps } from '../index';
import { RicosEditor } from '../index';
import type { RicosEditorRef } from '../RicosEditorRef';

const mountEditor = (
  isTiptap: boolean,
  ref?: RefObject<RicosEditorRef>,
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
  const ref = createRef<RicosEditorRef>();
  mountEditor(isTiptap, ref, { ...props });
  return ref;
};

const getDraftRef = (props?: RicosEditorProps) => getEditorRef(false, props);

const getTiptapRef = (props?: RicosEditorProps) => getEditorRef(true, props);

describe('RicosEditorSwitcher', () => {
  const validateRef = (ref: RefObject<RicosEditorRef>) => {
    expect(typeof ref.current?.blur).toBe('function');
    expect(typeof ref.current?.focus).toBe('function');
    expect(typeof ref.current?.getContent).toBe('function');
    expect(typeof ref.current?.getContentPromise).toBe('function');
    expect(typeof ref.current?.getContentTraits).toBe('function');
    expect(typeof ref.current?.getEditorCommands).toBe('function');
    expect(typeof ref.current?.getToolbarProps).toBe('function');
    expect(typeof ref.current?.getEditorCommands().undo).toBe('function');
    expect(typeof ref.current?.getContentTraits().isContentChanged).toBe('boolean');
  };

  describe('Draft', () => {
    it('should have all editor ref API', async () => {
      const editorRef = getDraftRef({ content });
      validateRef(editorRef);
    });
  });

  // eslint-disable-next-line mocha/no-skipped-tests
  describe.skip('Tiptap', () => {
    it('should have all editor ref API', async () => {
      const editorRef = getTiptapRef({ content });
      await wait();
      validateRef(editorRef);
    });
  });
});
