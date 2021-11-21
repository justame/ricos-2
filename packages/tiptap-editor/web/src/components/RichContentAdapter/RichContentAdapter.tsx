import { TiptapAPI } from '../../types';
import { capitalize } from 'lodash';
import {
  RICOS_LINK_TYPE,
  TranslationFunction,
  EditorPlugin,
  TextAlignment,
  RICOS_TEXT_COLOR_TYPE,
  RICOS_TEXT_HIGHLIGHT_TYPE,
} from 'wix-rich-content-common';
import { Editor } from '@tiptap/core';
import {
  generateId,
  HEADER_BLOCK,
  UNSTYLED,
  BULLET_LIST_TYPE,
  CODE_BLOCK_TYPE,
  BLOCKQUOTE,
  HEADINGS_TYPE,
  NUMBERED_LIST_TYPE,
} from 'ricos-content';

const headingTypeToLevelMap = {
  'header-one': 1,
  'header-two': 2,
  'header-three': 3,
  'header-four': 4,
  'header-five': 5,
  'header-six': 6,
};
import { TO_TIPTAP_TYPE } from '../../consts';

// todo : should change to RichContentInterface
export class RichContentAdapter implements TiptapAPI {
  constructor(
    private editor: Editor,
    private t: TranslationFunction,
    private plugins: EditorPlugin[]
  ) {
    this.editor = editor;
    this.t = t;
    this.plugins = plugins;
  }

  getContainer = () => {
    return this.editor?.options?.element;
  };

  focus() {
    this.editor.commands.focus();
  }

  blur() {
    this.editor.commands.blur();
  }

  getEditorCommands() {
    return {
      ...this.editorMocks,
      toggleInlineStyle: inlineStyle => {
        const editorCommand = this.editor.chain().focus();
        const styleName = `toggle${capitalize(inlineStyle)}`;
        editorCommand[styleName]().run();
      },
      hasInlineStyle: style => {
        const {
          state: {
            doc,
            selection: { from, to },
          },
        } = this.editor;

        const marks = {};
        doc.nodesBetween(from, to, node => {
          node.marks.forEach(({ type: { name } }) => {
            marks[name] = true;
          });
        });

        return marks[style];
      },
      insertBlock: (pluginType, data) => {
        const type = TO_TIPTAP_TYPE[pluginType];
        let id = '';
        if (type) {
          id = generateId();
          const attrs = { id, ...data };
          this.editor.commands.insertNode(type, attrs);
        } else {
          console.error(`No such plugin type ${pluginType}`);
        }
        return id;
      },
      deleteBlock: blockKey => {
        return this.editor.commands.deleteNode(blockKey);
      },
      findNodeByKey() {},
      setBlock: (blockKey, pluginType, data) => {
        return this.editor.commands.updateNodeById(blockKey, data);
      },
      getSelection: () => ({
        isFocused: this.editor.isFocused,
        isCollapsed: this.editor.state.selection.empty,
      }),

      insertDecoration: (type, data) => {
        const decorationCommandMap = {
          [RICOS_LINK_TYPE]: data => this.editor.commands.setLink({ link: data }),
          [RICOS_TEXT_COLOR_TYPE]: data => this.editor.commands.setColor(data.color),
          [RICOS_TEXT_HIGHLIGHT_TYPE]: data => this.editor.commands.setHighlight(data.color),
        };
        if (decorationCommandMap[type]) {
          decorationCommandMap[type](data);
        } else {
          console.error(`${type} decoration not supported`);
        }
      },
      hasLinkInSelection: () => {
        const {
          state: {
            doc,
            selection: { from, to },
          },
        } = this.editor;

        const marks: Record<string, boolean> = {};
        doc.nodesBetween(from, to, node => {
          node.marks.forEach(({ type: { name } }) => {
            marks[name] = true;
          });
        });
        return marks.link;
      },

      getLinkDataInSelection: () => {
        const {
          state: {
            doc,
            selection: { from, to },
          },
        } = this.editor;

        let link;
        doc.nodesBetween(from, to, node => {
          node.marks.forEach(mark => {
            const {
              type: { name },
            } = mark;
            if (name === 'link') {
              link = mark.attrs.link;
            }
          });
        });
        return link;
      },
      setBlockType: type => {
        const blockTypeCommandMap = {
          [UNSTYLED]: () => this.editor.commands.setParagraph(),
          [HEADINGS_TYPE]: level => this.editor.commands.toggleHeading({ level }),
          [BLOCKQUOTE]: () => this.editor.commands.toggleBlockquote(),
          [CODE_BLOCK_TYPE]: () => this.editor.commands.toggleCodeBlock(),
          [BULLET_LIST_TYPE]: () => this.editor.commands.toggleBulletList(),
          [NUMBERED_LIST_TYPE]: () => this.editor.commands.toggleOrderedList(),
        };
        if (Object.values(HEADER_BLOCK).includes(type)) {
          blockTypeCommandMap.headings(headingTypeToLevelMap[type]);
        } else if (blockTypeCommandMap[type]) {
          blockTypeCommandMap[type]();
        } else {
          console.error(`${type} block type not supported`);
        }
      },
      deleteDecoration: type => {
        const deleteDecorationCommandMap = {
          [RICOS_LINK_TYPE]: () => this.editor.commands.unsetLink(),
        };
        if (deleteDecorationCommandMap[type]) {
          deleteDecorationCommandMap[type]();
        } else {
          console.error(`delete ${type} decoration type not supported`);
        }
      },
    };
  }

  getToolbars() {
    return {
      // MobileToolbar: () => <Toolbar editor={this.editor} />,
      // TextToolbar: () => <Toolbar editor={this.editor} />,
    };
  }

  getToolbarProps() {
    return {};
  }

  destroy!: () => null;

  getT() {
    return this.t;
  }

  getPlugins() {
    return this.plugins;
  }

  editorMocks = {
    getAnchorableBlocks: () => ({
      anchorableBlocks: [],
      pluginsIncluded: [],
    }),
    getColor: () => 'unset',
    getFontSize: () => 'big',
    getTextAlignment: (): TextAlignment => 'center',
    isBlockTypeSelected: () => false,
    isUndoStackEmpty: () => false,
    isRedoStackEmpty: () => false,
    getSelectedData: () => 'blah',
    getPluginsList: () => [],
    scrollToBlock: _blockKey => {},
    isBlockInContent: _blockKey => false,
    toggleBlockOverlay: _blockKey => false,
    getBlockSpacing: () => 5,
    saveEditorState: () => {},
    loadEditorState: () => {},
    saveSelectionState: () => {},
    loadSelectionState: () => {},
    triggerDecoration: () => {},
    undo: () => {},
    redo: () => {},
    setBlockType: () => {},
    setTextAlignment: () => {},
    _setSelection: () => {},
    getDocumentStyle: () => undefined,
    getAnchorBlockInlineStyles: () => {
      return {};
    },
    updateDocumentStyle: () => {},
    clearSelectedBlocksInlineStyles: () => {},
    getWiredFontStyles: () => undefined,
    isAtomicBlockInSelection: () => false,
    getAnchorBlockType: () => 'paragraph',
  };
}
