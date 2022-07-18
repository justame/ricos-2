import * as setNodeSize from './node-commands/setNodeSize';
import * as setNodeAlignment from './node-commands/setNodeAlignment';
import * as toggleNodeTextWrap from './node-commands/toggleNodeTextWrap';
import type { RicosExtension } from 'ricos-types';

export const commonNodeCommands: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'ricos-common-node-commands',
  createExtensionConfig() {
    return {
      name: this.name,
      addCommands() {
        return {
          ...setNodeSize,
          ...setNodeAlignment,
          ...toggleNodeTextWrap,
        };
      },
    };
  },
};
