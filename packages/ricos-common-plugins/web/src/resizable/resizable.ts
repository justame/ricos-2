import type { TiptapEditorPlugin } from 'ricos-types';
import { resizable } from './extension';

export const pluginResizable: TiptapEditorPlugin = {
  type: 'RESIZABLE',
  config: {},
  tiptapExtensions: [resizable],
};
