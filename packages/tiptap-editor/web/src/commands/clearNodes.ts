import type { RawCommands } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    clearNodes: {
      /**
       * Normalize nodes to a simple paragraph.
       */
      clearNodes: () => ReturnType;
    };
  }
}

export const clearNodes: RawCommands['clearNodes'] =
  () =>
  ({ commands }) => {
    console.error('Do not use clearNodes, you will lose the id attribute (among all other attrs)');
    return commands.clearNodes();
  };
