import type { Editor } from '@tiptap/react';
import { pipe } from 'fp-ts/function';
import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import type { RicosExtension } from 'ricos-types';

const isInSelection = (selection: Editor['state']['selection']) => (position: number) =>
  position >= selection.$from.pos && position <= selection.$to.pos;

const useIsSelected = (editor: Editor, getPos: () => number) => {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    const onSelectionUpdate = ({ editor }) =>
      pipe(getPos(), isInSelection(editor.state.selection), setSelected);
    editor.on('selectionUpdate', onSelectionUpdate);
    return () => {
      editor.off('selectionUpdate', onSelectionUpdate);
    };
  }, []);

  return isSelected;
};

const FocusHoc = (Component: ComponentType) => {
  const Focus = props => (
    <Component {...props} isFocused={useIsSelected(props.editor, props.getPos)} />
  );
  Focus.displayName = 'FocusHoc';
  return Focus;
};

export const focus: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'focus',
  createExtensionConfig() {
    return {
      name: this.name,
      priority: 20,
      addNodeHoc: () => ({
        priority: 100,
        nodeTypes: ['*'],
        nodeHoc: FocusHoc,
      }),
    };
  },
};
