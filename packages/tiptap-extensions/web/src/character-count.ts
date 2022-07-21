import { Plugin, PluginKey } from 'prosemirror-state';
import type { ExtensionProps, RicosExtension, RicosExtensionConfig } from 'ricos-types';

const MAX_TEXT_LENGTH = 500000;

export const characterCount: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'characterCount',
  reconfigure: (
    config: RicosExtensionConfig,
    _extensions: RicosExtension[],
    ricosProps: ExtensionProps
  ) => ({
    ...config,
    addOptions() {
      return {
        maxTextLength: Math.min(ricosProps.maxTextLength || MAX_TEXT_LENGTH, MAX_TEXT_LENGTH),
        mode: 'textSize',
      };
    },
  }),
  createExtensionConfig() {
    return {
      name: this.name,

      addStorage() {
        return {
          characters: () => 0,
          words: () => 0,
        };
      },
      onBeforeCreate() {
        this.storage.characters = options => {
          const node = options?.node || this.editor.state.doc;
          const mode = options?.mode || this.options.mode;

          if (mode === 'textSize') {
            const text = node.textBetween(0, node.content.size, undefined, ' ');

            return text.length;
          }

          return node.nodeSize;
        };

        this.storage.words = options => {
          const node = options?.node || this.editor.state.doc;
          const text = node.textBetween(0, node.content.size, ' ', ' ');
          const words = text.split(' ').filter(word => word !== '');

          return words.length;
        };
      },

      addProseMirrorPlugins() {
        return [
          new Plugin({
            key: new PluginKey('characterCount'),
            filterTransaction: (transaction, state) => {
              const limit = this.options.maxTextLength;

              // Nothing has changed or no limit is defined. Ignore it.
              if (!transaction.docChanged || limit === 0 || limit === null || limit === undefined) {
                return true;
              }

              const oldSize = this.storage.characters({ node: state.doc });
              const newSize = this.storage.characters({ node: transaction.doc });

              // Everything is in the limit. Good.
              if (newSize <= limit) {
                return true;
              }

              // The limit has already been exceeded but will be reduced.
              if (oldSize > limit && newSize > limit && newSize <= oldSize) {
                return true;
              }

              // The limit has already been exceeded and will be increased further.
              if (oldSize > limit && newSize > limit && newSize > oldSize) {
                return false;
              }

              const isPaste = transaction.getMeta('paste');

              // Block all exceeding transactions that were not pasted.
              if (!isPaste) {
                return false;
              }

              // For pasted content, we try to remove the exceeding content.
              const pos = transaction.selection.$head.pos;
              const over = newSize - limit;
              const from = pos - over;
              const to = pos;

              // It’s probably a bad idea to mutate transactions within `filterTransaction`
              // but for now this is working fine.
              transaction.deleteRange(from, to);

              // In some situations, the limit will continue to be exceeded after trimming.
              // This happens e.g. when truncating within a complex node (e.g. table)
              // and ProseMirror has to close this node again.
              // If this is the case, we prevent the transaction completely.
              const updatedSize = this.storage.characters({ node: transaction.doc });

              if (updatedSize > limit) {
                return false;
              }

              return true;
            },
          }),
        ];
      },
    };
  },
};
