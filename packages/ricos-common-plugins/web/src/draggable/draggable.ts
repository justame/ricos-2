import type { TiptapEditorPlugin } from 'ricos-types';
import { draggable } from './extension';

export const pluginDraggable: TiptapEditorPlugin = {
  type: 'DRAGGABLE',
  config: {},
  tiptapExtensions: [draggable],
};
