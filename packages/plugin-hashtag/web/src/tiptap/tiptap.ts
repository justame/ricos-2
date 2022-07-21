import type { Group, RicosExtension } from 'ricos-types';
import findHashTag from './findHashTag';

export const tiptapExtensions: RicosExtension[] = [
  {
    type: 'mark' as const,
    groups: [] as Group[],
    name: 'HASHTAG',
    createExtensionConfig({ Plugin }) {
      return {
        name: this.name,
        addProseMirrorPlugins() {
          return [
            new Plugin({
              state: {
                init(_, { doc }) {
                  return findHashTag(doc);
                },
                apply(transaction, oldState) {
                  return transaction.docChanged ? findHashTag(transaction.doc) : oldState;
                },
              },
              props: {
                decorations(state) {
                  return this.getState(state);
                },
              },
            }),
          ];
        },
      };
    },
  },
];
