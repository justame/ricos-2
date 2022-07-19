/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NodeType } from 'prosemirror-model';
import type { RawCommands } from '@tiptap/core';
import { getNodeType, isNodeActive } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toggleTextNode: {
      /**
       * Toggle a node with another node.
       */
      toggleTextNode: (
        typeOrName: string | NodeType,
        toggleTypeOrName: string | NodeType,
        attributes?: Record<string, any>
      ) => ReturnType;
    };
  }
}

export const toggleTextNode: RawCommands['toggleTextNode'] =
  (typeOrName, toggleTypeOrName, attributes = {}) =>
  ({ chain }) => {
    return (
      chain()
        // try to toggle off lists if exists
        .toggleOffOrderedList()
        .toggleOffBulletList()
        .command(({ state, commands }) => {
          const type = getNodeType(typeOrName, state.schema);
          const toggleType = getNodeType(toggleTypeOrName, state.schema);
          const isActive = isNodeActive(state, type, attributes);

          if (isActive) {
            return commands.updateTextNode(toggleType);
          }

          return commands.updateTextNode(type, attributes);
        })
        .run()
    );
  };
