import { createCodeBlockPlugin } from './createCodeBlockPlugin';
import type { CodeBlockPluginEditorConfig } from './types';
import { CODE_BLOCK_TYPE } from './types';
import { DEFAULTS } from './defaults';
import type { EditorPluginCreator } from 'wix-rich-content-common';
import { tiptapExtensions } from './tiptap';
import type { EditorCommands, TiptapEditorPlugin } from 'ricos-types';
import { getAddButtons } from './getAddButtons';
import { getTextButtons } from './getTextButtons';

export const pluginCodeBlock: EditorPluginCreator<CodeBlockPluginEditorConfig> = config => {
  const pluginConfig = { ...DEFAULTS.config, ...config };
  return {
    config: pluginConfig,
    type: CODE_BLOCK_TYPE,
    createPlugin: createCodeBlockPlugin,
    ModalsMap: {},
    shortcuts: [
      {
        name: 'codeBlock',
        description: 'Toggles code style of selected text',
        keys: 'Meta+Shift+C',
        command(editorCommands: EditorCommands) {
          editorCommands.setBlockType(CODE_BLOCK_TYPE);
        },
        group: 'formatting',
        keyCombinationText: 'Cmd+Shift+C',
        enabled: true,
      },
    ],
    getAddButtons: () => getAddButtons(),
    tiptapExtensions,
    textButtons: getTextButtons(),
  } as TiptapEditorPlugin;
};
