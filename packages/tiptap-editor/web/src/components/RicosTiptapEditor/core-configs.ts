import { commands } from '../../core-commands';
import {
  draft,
  focus,
  undoRedo,
  styles,
  paragraph,
  text,
  doc,
  trailingNode,
  uniqueId,
  textDirection,
  dropcursor,
} from 'wix-tiptap-extensions';

export const coreConfigs = [
  draft,
  focus,
  undoRedo,
  styles,
  paragraph,
  text,
  doc,
  trailingNode,
  uniqueId,
  textDirection,
  commands,
  dropcursor,
];
