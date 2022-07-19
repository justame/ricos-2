/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NodeType } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { RawCommands } from '@tiptap/core';
import { getNodeType } from '@tiptap/core';
import { Node_Type } from 'ricos-schema';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    updateTextNode: {
      /**
       * Update selected text nodes.
       */
      updateTextNode: (
        typeOrName: string | NodeType,
        attributes?: Record<string, any>
      ) => ReturnType;
    };
  }
}

export function updateBlockType(nodeType: NodeType, attrs: Record<string, any>) {
  return function (state: EditorState, dispatch?: EditorView['dispatch']) {
    const { from, to } = state.selection;
    let applicable = false;
    const tr = state.tr;
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (applicable) return false;
      if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return;
      if (node.type === nodeType) {
        applicable = true;
      } else {
        const $pos = state.doc.resolve(pos),
          index = $pos.index();
        applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
      }
    });
    if (!applicable) return false;
    if (dispatch) {
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return;
        const $pos = state.doc.resolve(pos);
        const parentNode = $pos.parent;
        if (parentNode.type.name !== Node_Type.LIST_ITEM) {
          tr.setNodeMarkup(pos, nodeType, { ...node.attrs, ...attrs });
        }
      });
      dispatch(tr);
    }
    return true;
  };
}

export const updateTextNode: RawCommands['updateTextNode'] =
  (typeOrName, attributes = {}) =>
  ({ state, dispatch, chain }) => {
    const type = getNodeType(typeOrName, state.schema);

    return (
      chain()
        // try to convert node to default node if needed
        .command(({ commands }) => {
          const canSetBlock = updateBlockType(type, attributes)(state);

          if (canSetBlock) {
            return true;
          }

          return commands.normalizeNodes();
        })
        .command(({ state: updatedState }) => {
          return updateBlockType(type, attributes)(updatedState, dispatch);
        })
        .run()
    );
  };
