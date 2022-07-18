import { TIPTAP_LINK_BUTTON_TYPE, TIPTAP_ACTION_BUTTON_TYPE } from 'ricos-content';
import buttonDataDefaults from 'ricos-schema/dist/statics/button.defaults.json';
import type { ExtensionProps, NodeConfig, RicosExtension } from 'ricos-types';
import { Button as Component } from './component';
import { LINK_BUTTON_TYPE, ACTION_BUTTON_TYPE } from '../types';

const getButtonExtension = name => [
  {
    type: 'node' as const,
    groups: ['react'],
    reconfigure: (
      config: NodeConfig,
      _extensions: RicosExtension[],
      _props: ExtensionProps,
      settings: Record<string, unknown>
    ) => ({
      ...config,
      addOptions: () => settings,
    }),
    Component,
    name,
    createExtensionConfig() {
      return {
        name: this.name,
        group: 'block',
        selectable: true,
        draggable: true,
        addAttributes: () => buttonDataDefaults,
      };
    },
  },
];

export const tiptapExtensionsMap = {
  [LINK_BUTTON_TYPE]: getButtonExtension(TIPTAP_LINK_BUTTON_TYPE),
  [ACTION_BUTTON_TYPE]: getButtonExtension(TIPTAP_ACTION_BUTTON_TYPE),
};
