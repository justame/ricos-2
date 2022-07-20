import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type {
  ExtensionProps,
  RicosExtension,
  RicosExtensionConfig,
  RicosNodeExtension,
  RicosServices,
} from 'ricos-types';
import { compact } from 'lodash';

export const placeholder: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'placeholder',
  reconfigure: (
    config: RicosExtensionConfig,
    _extensions: RicosExtension[],
    ricosProps: ExtensionProps,
    _settings: Record<string, unknown>,
    services: RicosServices
  ) => ({
    ...config,
    addOptions() {
      return {
        emptyEditorClass: 'is-editor-empty',
        emptyNodeClass: 'is-node-empty',
        placeholder: ricosProps.placeholder || '',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
        includeChildren: false,
        t: services.t,
        extensionsPlaceholders: compact(
          _extensions
            .filter(ext => ext.type === 'node')
            .map((ext: RicosNodeExtension) => ext.placeholder)
        ),
      };
    },
  }),
  createExtensionConfig() {
    return {
      name: this.name,
      addProseMirrorPlugins() {
        return [
          new Plugin({
            key: new PluginKey('editor-placeholder'),
            props: {
              decorations: ({ doc, selection }) => {
                const active = this.editor.isEditable || !this.options.showOnlyWhenEditable;
                const { anchor } = selection;
                const decorations: Decoration[] = [];

                if (!active) {
                  return;
                }
                // TODO: this.editor.isEmpty returns false for our empty content (checks nodes === 0)
                const isEditorEmpty =
                  this.editor.getText() === '' && this.editor.getJSON().content.length === 1;

                isEditorEmpty &&
                  doc.descendants((node, pos) => {
                    const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
                    const isEmpty = !node.isLeaf && !node.childCount;
                    if (isEmpty && (hasAnchor || !this.options.showOnlyCurrent)) {
                      const classes: string[] = [];
                      classes.push(this.options.emptyEditorClass);
                      const decoration = Decoration.node(pos, pos + node.nodeSize, {
                        class: classes.join(' '),
                        'data-placeholder':
                          typeof this.options.placeholder === 'function'
                            ? this.options.placeholder({
                                editor: this.editor,
                                node,
                                pos,
                              })
                            : this.options.placeholder,
                      });

                      decorations.push(decoration);
                      return this.options.includeChildren;
                    }
                  });

                return DecorationSet.create(doc, decorations);
              },
            },
          }),
          new Plugin({
            key: new PluginKey('extension-placeholder'),
            props: {
              decorations: ({ doc }) => {
                const decorations: Decoration[] = [];

                doc.descendants((node, pos) => {
                  const isEmpty = !node.isLeaf && !node.childCount;
                  if (isEmpty) {
                    if (this.options.extensionsPlaceholders.length) {
                      this.options.extensionsPlaceholders.forEach(
                        ({ predicate, translationKey, content }) => {
                          if (predicate({ doc, pos, node })) {
                            const { t } = this.options;
                            const classes = [this.options.emptyNodeClass];
                            const decoration = Decoration.node(pos, pos + node.nodeSize, {
                              class: classes.join(' '),
                              'data-placeholder': translationKey && t ? t(translationKey) : content,
                            });

                            decorations.push(decoration);
                          }
                        }
                      );

                      return true;
                    }
                  }
                });

                return DecorationSet.create(doc, decorations);
              },
            },
          }),
        ];
      },
    };
  },
};
