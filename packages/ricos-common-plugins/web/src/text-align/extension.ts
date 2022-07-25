import type { ExtensionProps, RicosExtension, RicosExtensionConfig } from 'ricos-types';
import { Node_Type, TextStyle_TextAlignment } from 'ricos-schema';
import { Plugin, PluginKey } from 'prosemirror-state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textAlign: {
      /**
       * Set the text align attribute
       */
      setTextAlign: (alignment: string) => ReturnType;
      unsetTextAlign: () => ReturnType;
    };
  }
}

const enumToStyle = (textAlignment: TextStyle_TextAlignment): string =>
  textAlignment === TextStyle_TextAlignment.AUTO ? 'initial' : textAlignment.toLowerCase();

const styleToEnum = (textAlign?: string): TextStyle_TextAlignment =>
  textAlign === 'initial' || !textAlign
    ? TextStyle_TextAlignment.AUTO
    : (textAlign.toUpperCase() as TextStyle_TextAlignment);

export const textAlign: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'textAlign',
  reconfigure(
    config: RicosExtensionConfig,
    extensions: RicosExtension[],
    ricosProps: ExtensionProps
  ) {
    const types = extensions
      .filter(extension => extension.groups.includes('text-container'))
      .map(({ name }) => name);

    return {
      ...config,
      addOptions() {
        return {
          alignments: [
            TextStyle_TextAlignment.AUTO,
            TextStyle_TextAlignment.CENTER,
            TextStyle_TextAlignment.LEFT,
            TextStyle_TextAlignment.RIGHT,
            TextStyle_TextAlignment.JUSTIFY,
          ],
          textAlignment: styleToEnum(ricosProps.textAlignment) || TextStyle_TextAlignment.AUTO,
        };
      },
      addGlobalAttributes() {
        return [
          {
            types,
            attributes: {
              textStyle: {
                default: this.options.textAlignment,
                parseHTML: element => {
                  return {
                    textAlignment:
                      styleToEnum(element.style.textAlign) || this.options.textAlignment,
                  };
                },
                renderHTML: attributes => {
                  if (
                    attributes?.textStyle?.textAlignment &&
                    attributes?.textStyle?.textAlignment !== this.options.textAlignment
                  ) {
                    return {
                      style: `text-align: ${enumToStyle(attributes.textStyle.textAlignment)}`,
                    };
                  }
                  return {
                    style: `text-align: ${enumToStyle(this.options.textAlignment)}`,
                  };
                },
              },
            },
          },
        ];
      },
      addCommands() {
        return {
          setTextAlign:
            (alignment: string) =>
            ({ commands }) => {
              const textAlignment = styleToEnum(alignment);
              if (!this.options.alignments.includes(textAlignment)) {
                console.error(
                  `invalid text alignment ${alignment} provided to setTextAlign command`
                );
                return false;
              }

              return types.every(type =>
                commands.updateAttributes(type, {
                  textStyle: { textAlignment },
                })
              );
            },
          unsetTextAlign:
            () =>
            ({ commands }) =>
              types.every(type =>
                commands.updateAttributes(type, {
                  textStyle: { textAlignment: this.options.textAlignment },
                })
              ),
        };
      },
    };
  },
  createExtensionConfig() {
    return {
      name: this.name,
      priority: 3,
      addKeyboardShortcuts() {
        return {
          'Mod-Shift-l': () => this.editor.commands.setTextAlign(TextStyle_TextAlignment.LEFT),
          'Mod-Shift-e': () => this.editor.commands.setTextAlign(TextStyle_TextAlignment.CENTER),
          'Mod-Shift-r': () => this.editor.commands.setTextAlign(TextStyle_TextAlignment.RIGHT),
          'Mod-Shift-j': () => this.editor.commands.setTextAlign(TextStyle_TextAlignment.JUSTIFY),
          'Mod-Shift-u': () => this.editor.commands.unsetTextAlign(),
        };
      },
      addProseMirrorPlugins() {
        return [
          new Plugin({
            key: new PluginKey('textAlign'),
            appendTransaction: (_transactions, oldState, newState) => {
              if (newState.doc === oldState.doc) {
                return;
              }
              const tr = newState.tr;
              const { from, to } = newState.selection;
              newState.doc.nodesBetween(from, to, (node, pos) => {
                let textStyle;
                if ([Node_Type.LIST_ITEM].includes(node.type.name as Node_Type)) {
                  textStyle = node.firstChild?.attrs.textStyle;
                  textStyle &&
                    textStyle !== node.attrs.textStyle &&
                    tr.setNodeMarkup(pos, undefined, {
                      ...node.attrs,
                      textStyle,
                    });
                }
              });
              return tr;
            },
          }),
        ];
      },
    };
  },
};
