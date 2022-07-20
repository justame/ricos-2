import type { RawCommands } from '@tiptap/core';
import type { NodeType } from 'prosemirror-model';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setNode: {
      /**
       * Replace a given range with a node.
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNode: (typeOrName: string | NodeType, attributes?: Record<string, any>) => ReturnType;
    };
  }
}

export const setNode: RawCommands['setNode'] =
  (typeOrName, attributes) =>
  ({ commands }) => {
    console.error('Do not use setNode, you will lose the id attribute (among all other attrs)');
    return commands.setNode(typeOrName, attributes);
  };
