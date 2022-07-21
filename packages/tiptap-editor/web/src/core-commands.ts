import * as insertNode from './commands/insertNode';
import * as updateTextNode from './commands/updateTextNode';
import * as toggleTextNode from './commands/toggleTextNode';
import * as normalizeNodes from './commands/normalizeNodes';
import * as clearNodes from './commands/clearNodes';
import * as setNode from './commands/setNode';
import * as setNodeAttrsById from './commands/setNodeAttrsById';
import * as updateNodeAttrsById from './commands/updateNodeAttrsById';
import * as replaceNode from './commands/replaceNode';
import * as replaceNodes from './commands/replaceNodes';
import * as deleteNode from './commands/deleteNode';
import * as updateAttributesWithDeepMerge from './commands/updateAttributesWithDeepMerge';
import type { RicosExtension } from 'ricos-types';

export const commands: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'ricos-node-commands',
  createExtensionConfig() {
    return {
      name: this.name,
      addCommands() {
        return {
          ...insertNode,
          ...updateTextNode,
          ...toggleTextNode,
          ...normalizeNodes,
          ...clearNodes,
          ...setNode,
          ...setNodeAttrsById,
          ...updateNodeAttrsById,
          ...deleteNode,
          ...replaceNode,
          ...replaceNodes,
          ...updateAttributesWithDeepMerge,
        };
      },
    };
  },
};
