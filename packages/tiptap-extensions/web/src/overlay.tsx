import React from 'react';
import type { ExtensionProps, RicosExtension, RicosExtensionConfig } from 'ricos-tiptap-types';
import styles from './statics/styles.scss';

const OverlayHoc = Component => {
  const Overlay = props => {
    return (
      <div className={styles.overlay} role="none">
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
