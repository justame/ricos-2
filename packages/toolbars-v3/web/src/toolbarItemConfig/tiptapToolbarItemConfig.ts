import type { IToolbarItemConfigTiptap } from 'ricos-types';
import { PlusIcon } from '../icons';
import { alwaysVisibleResolver } from '../resolvers/tiptapResolvers';

export const tiptapStaticToolbarConfig: IToolbarItemConfigTiptap[] = [
  {
    id: 'addPlugin',
    type: 'modal',
    presentation: {
      icon: PlusIcon,
    },
    attributes: {
      visible: alwaysVisibleResolver,
    },
    commands: {},
  },
  {
    id: 'separator',
    type: 'separator',
    presentation: {},
    attributes: {
      visible: alwaysVisibleResolver,
    },
    commands: {},
  },
];
