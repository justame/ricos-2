import { liftTarget } from 'prosemirror-transform';

import type { RawCommands } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    normalizeNodes: {
      /**
       * Normalize nodes to a simple paragraph (keeps attrs).
       */
      normalizeNodes: () => ReturnType;
    };
  }
}

export const normalizeNodes: RawCommands['normalizeNodes'] =
  () =>
  ({ state, tr, dispatch }) => {
    const { selection } = tr;
    const { ranges } = selection;

    if (!dispatch) {
      return true;
    }

    ranges.forEach(({ $from, $to }) => {
      state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
        if (node.type.isText) {
          return;
        }

        const { doc, mapping } = tr;
        const $mappedFrom = doc.resolve(mapping.map(pos));
        const $mappedTo = doc.resolve(mapping.map(pos + node.nodeSize));
        const nodeRange = $mappedFrom.blockRange($mappedTo);

        if (!nodeRange) {
          return;
        }

        const targetLiftDepth = liftTarget(nodeRange);

        if (node.type.isTextblock) {
          const { defaultType } = $mappedFrom.parent.contentMatchAt($mappedFrom.index());

          // the only difference from tiptap clearNodes, keep the attrs
          tr.setNodeMarkup(pos, defaultType, node.attrs);
        }

        if (targetLiftDepth || targetLiftDepth === 0) {
          tr.lift(nodeRange, targetLiftDepth);
        }
      });
    });

    return true;
  };
