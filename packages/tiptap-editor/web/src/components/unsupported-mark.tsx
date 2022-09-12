import type { MarkConfig } from '@tiptap/core';
import type { Decoration_Type } from 'ricos-schema';
import type { RicosMarkExtension } from 'ricos-types';

/**
 * Creates RicosExtension for unsupported mark, dynamically
 */
export const getUnsupportedMarkConfig = ({
  unsupportedMarkType,
  ...attrs
}: {
  unsupportedMarkType: string;
  attrs: Record<string, unknown>;
}): RicosMarkExtension => ({
  type: 'mark' as const,
  groups: [],
  name: unsupportedMarkType as Decoration_Type,
  createExtensionConfig: (): MarkConfig => ({
    name: unsupportedMarkType,
    addAttributes: () => attrs,
    addOptions: () => ({
      HTMLAttributes: {},
    }),
    parseHTML() {
      return [
        {
          tag: 'abbr',
        },
      ];
    },

    renderHTML() {
      return [
        'abbr',
        {
          title: `'${unsupportedMarkType}' decoration is not supported by editor. Check editor configuration.`,
          style: 'cursor: help',
        },
        0,
      ];
    },
  }),
});
