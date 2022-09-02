import type { RicosExtension, RicosExtensionConfig } from 'ricos-types';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { generateId } from 'ricos-content';
import { browser } from 'wix-rich-content-editor-common';

function minMax(value = 0, min = 0, max = 0): number {
  return Math.min(Math.max(value, min), max);
}

/*
  This fix a bug with Android when using setNodeType in appendTransaction.
  The bug is that the cursor is not positioned correctly after the transaction
  so we have to manually set the cursor position.
*/
const handleAndroidEnterBug = (tr, pos) => {
  const { doc } = tr;
  const { from, to } = { from: pos + 1, to: pos + 1 };

  const minPos = TextSelection.atStart(doc).from;
  const maxPos = TextSelection.atEnd(doc).to;
  const resolvedFrom = minMax(from, minPos, maxPos);
  const resolvedEnd = minMax(to, minPos, maxPos);
  const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd);
  tr.setSelection(selection);
};

export const uniqueId: RicosExtension = {
  type: 'extension',
  groups: [],
  name: 'unique-id',
  reconfigure(config: RicosExtensionConfig, extensions: RicosExtension[]) {
    return {
      ...config,
      addGlobalAttributes() {
        return [
          {
            types: extensions
              .filter(extension => extension.type === 'node' && !extension.groups.includes('text'))
              .map(({ name }) => name),
            attributes: {
              id: {
                default: null,
              },
            },
          },
        ];
      },
    };
  },
  createExtensionConfig() {
    return {
      name: this.name,
      priority: 2, // should be before contentDiff
      addProseMirrorPlugins() {
        return [
          new Plugin({
            key: new PluginKey('unique-id'),
            appendTransaction: (_transactions, oldState, newState) => {
              if (newState.doc === oldState.doc) {
                return;
              }
              const tr = newState.tr;
              const usedIds = {};

              const { selection } = oldState;
              const marks = selection.$to.parentOffset && selection.$from.marks();

              newState.doc.descendants((node, pos) => {
                const nodeId = node.attrs.id;
                const id = nodeId && !usedIds[nodeId] ? nodeId : generateId();
                usedIds[id] = true;
                const shouldUpdate = nodeId !== id;

                if (node.isBlock && shouldUpdate) {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    id,
                    marks,
                  });
                  tr.setMeta('unique-id', true); // do not remove this meta, it's used in content-diff

                  // this should run before ensureMarks becasuse it resets the marks
                  // also ignore tralingNode insertion
                  if (browser.android && !tr.getMeta('trailingNodeInsertion')) {
                    handleAndroidEnterBug(tr, pos);
                  }

                  marks && tr.ensureMarks(marks);
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
