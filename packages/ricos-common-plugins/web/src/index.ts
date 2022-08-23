import { pluginBlockquote } from './blockquote/blockquote';
import { pluginBold } from './bold/bold';
import { pluginBulletedList } from './bulleted-list/bulleted-list';
import { pluginDraggable } from './draggable/draggable';
import { pluginFontSize } from './font-size/font-size';
import { pluginItalic } from './italic/italic';
import { pluginListItem } from './list-item/list-item';
import { pluginOrderedList } from './ordered-list/ordered-list';
import { pluginParagraph } from './paragraph/paragraph';
import { pluginResizable } from './resizable/resizable';
import { pluginTextAlignment } from './text-align/text-align';
import { pluginUnderline } from './underline/underline';
import { pluginUndoRedo } from './undo-redo/undo-redo';

import { AllSelection } from 'prosemirror-state';
import { INDENT_TYPE } from 'ricos-content';
import type { EditorPlugin } from 'ricos-types';
import { isTextSelection } from 'wix-rich-content-editor-common';

export const commonPlugins = [
  pluginBlockquote,
  pluginBold,
  pluginBulletedList,
  pluginFontSize,
  pluginItalic,
  pluginListItem,
  pluginOrderedList,
  pluginParagraph,
  pluginTextAlignment,
  pluginUnderline,
  pluginResizable,
  pluginDraggable,
  pluginUndoRedo,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as EditorPlugin<Record<string, any>>[];

export const commonPluginConfig = {
  [INDENT_TYPE]: { isTextSelection, AllSelection },
};
