import { dropCursor } from 'prosemirror-dropcursor';
import type { RicosExtension } from 'ricos-types';

export interface DropcursorOptions {
  color: string | undefined;
  width: number | undefined;
  class: string | undefined;
}

export const dropcursor: RicosExtension = {
  name: 'dropCursor',
  groups: [],
  type: 'extension' as const,

  createExtensionConfig() {
    return {
      name: this.name,
      addOptions() {
        return {
          color: 'currentColor',
          width: 1,
          class: undefined,
        };
      },

      addProseMirrorPlugins() {
        return [dropCursor(this.options)];
      },
    };
  },
};
