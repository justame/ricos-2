import { Node_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { listItem } from './extension';

export const pluginListItem: TiptapEditorPlugin = {
  type: Node_Type.LIST_ITEM,
  config: {},
  tiptapExtensions: [listItem],
};
