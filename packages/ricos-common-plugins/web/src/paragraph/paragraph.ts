import { Node_Type } from 'ricos-schema';
import type { TiptapEditorPlugin } from 'ricos-types';
import { paragraph } from './extension';

export const pluginParagraph: TiptapEditorPlugin = {
  type: Node_Type.PARAGRAPH,
  config: {},
  tiptapExtensions: [paragraph],
};
