import { Decoration_Type } from 'ricos-schema';
import fontSizeDataDefaults from 'ricos-schema/dist/statics/font_size.defaults.json';
import type { DOMOutputSpec, RicosExtension } from 'ricos-types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set a font mark
       */
      setFontSize: (size: number) => ReturnType;
    };
  }
}

export const fontSize: RicosExtension = {
  type: 'mark' as const,
  groups: [],
  name: Decoration_Type.FONT_SIZE,
  createExtensionConfig({ mergeAttributes }) {
    return {
      name: this.name,
      addAttributes() {
        return fontSizeDataDefaults;
      },

      renderHTML({ HTMLAttributes }) {
        const htmlAttrs = {
          style: `font-size: ${HTMLAttributes.value}${HTMLAttributes.unit.toLowerCase()}`,
        };
        return ['span', mergeAttributes(htmlAttrs), 0] as DOMOutputSpec;
      },
      addCommands() {
        return {
          setFontSize:
            (size: number) =>
            ({ commands }) => {
              if (!Number.isInteger(size) || size <= 0 || size > 900) {
                return false;
              }

              return commands.setMark(this.name, {
                value: size,
                unit: 'PX',
              });
            },
        };
      },
    };
  },
};
