import type { RicosExtension, RicosExtensionConfig } from 'ricos-types';

type LineSpacings = {
  'line-height': string;
  'padding-bottom': string;
  'padding-top': string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineSpacing: {
      /**
       * Set the text line spacings
       */
      setLineSpacings: (lineSpacings: LineSpacings) => ReturnType;
      /**
       * Set the text line spacing
       */
      setLineSpacing: (lineSpacing: number) => ReturnType;
      /**
       * Set the text line spacing before
       */
      // maybe it should have a style extension?
      setLineSpacingBefore: (lineSpacing: number) => ReturnType;
      /**
       * Set the text line spacing after
       */
      setLineSpacingAfter: (lineSpacing: number) => ReturnType;
    };
  }
}

export const lineSpacing: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'lineSpacing',
  reconfigure(config: RicosExtensionConfig, extensions: RicosExtension[]) {
    const types = extensions
      .filter(extension => extension.groups.includes('text-container'))
      .map(({ name }) => name);
    return {
      ...config,
      addGlobalAttributes() {
        return [
          {
            types,
            attributes: {
              textStyle: {
                renderHTML: attributes => {
                  const styles: string[] = [];
                  if (attributes?.textStyle?.lineHeight) {
                    styles.push(`line-height:${attributes.textStyle.lineHeight}`);
                  }
                  return {
                    style: styles.join(';'),
                  };
                },
              },
            },
          },
          {
            types,
            attributes: {
              style: {
                renderHTML: attributes => {
                  const styles: string[] = [];

                  if (attributes?.style?.paddingTop) {
                    styles.push(`padding-top:${attributes.style.paddingTop}`);
                  }
                  if (attributes?.style?.paddingBottom) {
                    styles.push(`padding-bottom:${attributes.style.paddingBottom}`);
                  }
                  return {
                    style: styles.join(';'),
                  };
                },
              },
            },
          },
        ];
      },
      addCommands() {
        return {
          setLineSpacings:
            lineSpacings =>
            ({ chain }) => {
              const {
                'line-height': stringLineHeight,
                'padding-bottom': stringPaddingBottom,
                'padding-top': stringPaddingTop,
              } = lineSpacings;
              const lineHeight = parseFloat(stringLineHeight);
              const paddingBottom = parseFloat(stringPaddingBottom);
              const paddingTop = parseFloat(stringPaddingTop);

              return chain()
                .focus()
                .setLineSpacing(lineHeight)
                .setLineSpacingBefore(paddingTop)
                .setLineSpacingAfter(paddingBottom)
                .run();
            },
          setLineSpacing:
            (lineSpacing: number) =>
            ({ commands }) => {
              if (lineSpacing > 100 || lineSpacing < 0) {
                return false;
              }
              return types.every(type =>
                commands.updateAttributesWithDeepMerge(type, {
                  textStyle: { lineHeight: lineSpacing },
                })
              );
            },
          setLineSpacingBefore:
            (lineSpacing: number) =>
            ({ commands }) => {
              if (lineSpacing > 100 || lineSpacing < 0) {
                return false;
              }
              return types.every(type =>
                commands.updateAttributesWithDeepMerge(type, {
                  style: {
                    paddingTop: `${lineSpacing}px`,
                  },
                })
              );
            },
          setLineSpacingAfter:
            (lineSpacing: number) =>
            ({ commands }) => {
              if (lineSpacing > 100 || lineSpacing < 0) {
                return false;
              }
              return types.every(type =>
                commands.updateAttributesWithDeepMerge(type, {
                  style: {
                    paddingBottom: `${lineSpacing}px`,
                  },
                })
              );
            },
        };
      },
    };
  },
  createExtensionConfig() {
    return {
      name: this.name,
    };
  },
};
