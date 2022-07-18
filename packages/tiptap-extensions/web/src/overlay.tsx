import React from 'react';
import type { ExtensionProps, RicosExtension, RicosExtensionConfig } from 'ricos-tiptap-types';
import styles from './statics/styles.scss';
import { NodeSelection } from 'prosemirror-state';

const setSelection = (editor, getPos) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selection = NodeSelection.create(editor.view.state.doc, (getPos as any)());
  const transaction = editor.view.state.tr.setSelection(selection);
  editor.view.dispatch(transaction);
};
const OverlayHoc = Component => {
  const Overlay = props => {
    return (
      <div
        className={styles.overlay}
        role="none"
        onClick={() => {
          setSelection(props.editor, props.getPos);
        }}
      >
        <Component {...props} />
      </div>
    );
  };
  Overlay.displayName = 'OverlayHoc';
  return Overlay;
};

export const overlay: RicosExtension = {
  type: 'extension' as const,
  name: 'overlay',
  groups: [],
  reconfigure: (
    config: RicosExtensionConfig,
    extensions: RicosExtension[],
    _props: ExtensionProps,
    settings: Record<string, unknown>
  ) => ({
    ...config,
    addOptions: () => settings,
    addNodeHoc: () => ({
      nodeTypes: extensions
        .filter(extension => extension.groups.includes('overlay'))
        .map(({ name }) => name),
      priority: 10,
      nodeHoc: OverlayHoc,
    }),
  }),
  createExtensionConfig() {
    return {
      name: this.name,
      priority: 10,
    };
  },
};
