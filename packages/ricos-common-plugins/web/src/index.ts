import { pluginBlockquote } from './blockquote/blockquote';
import { pluginBold } from './bold/bold';
import { pluginBulletedList } from './bulleted-list/bulleted-list';
import { pluginFontSize } from './font-size/font-size';
import { pluginItalic } from './italic/italic';
import { pluginListItem } from './list-item/list-item';
import { pluginOrderedList } from './ordered-list/ordered-list';
import { pluginParagraph } from './paragraph/paragraph';
import { pluginTextAlignment } from './text-align/text-align';
import { pluginUnderline } from './underline/underline';
import { pluginResizable } from './resizable/resizable';
import { pluginDraggable } from './draggable/draggable';

import { undo, redo, history } from './history-infra';
import { isTextSelection } from 'wix-rich-content-editor-common';
import { AllSelection } from 'prosemirror-state';
import { INDENT_TYPE, UNDO_REDO_TYPE } from 'ricos-content';
import type { EditorPlugin } from 'ricos-types';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as EditorPlugin<Record<string, any>>[];

export const commonPluginConfig = {
  [UNDO_REDO_TYPE]: { undo, redo, history },
  [INDENT_TYPE]: { isTextSelection, AllSelection },
};
