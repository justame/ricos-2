import type { EditorCommands, KeyboardShortcut } from 'ricos-types';
import { Node_Type } from 'ricos-types';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { HEADER_BLOCK } from 'wix-rich-content-common';
import { createHeadingsPlugin } from './createHeadingsPlugin';
import { DEFAULTS } from './defaults';
import { ModalsMap } from './modals';
import type { HeadingsPluginEditorConfig } from './types';
import { HEADINGS_DROPDOWN_TYPE } from './types';
import { getTextButtons } from './getTextButtons';

const headerBlockByLevel = [
  HEADER_BLOCK.ONE,
  HEADER_BLOCK.TWO,
  HEADER_BLOCK.THREE,
  HEADER_BLOCK.FOUR,
  HEADER_BLOCK.FIVE,
  HEADER_BLOCK.SIX,
];

const getShortcut = (level: 1 | 2 | 3 | 4 | 5 | 6): KeyboardShortcut =>
  ({
    name: `${Node_Type.HEADING}.${level}`,
    description: `Toggles H${level} style to current node`,
    keys: { macOs: `Meta+Alt+${level}`, windows: `Ctrl+Alt+${level}` },
    command(editorCommands: EditorCommands) {
      editorCommands.setBlockType(headerBlockByLevel[level - 1]);
    },
    group: 'formatting',
    keyCombinationText: `Meta+Opt+${level}`,
    enabled: true,
  } as KeyboardShortcut);

export const pluginHeadings: EditorPluginCreator<HeadingsPluginEditorConfig> = config => {
  return {
    config: { ...DEFAULTS.config, ...config },
    type: HEADINGS_DROPDOWN_TYPE,
    createPlugin: createHeadingsPlugin,
    ModalsMap,
    shortcuts: [1, 2, 3, 4, 5, 6].map(getShortcut),
    textButtons: getTextButtons(config),
  };
};
