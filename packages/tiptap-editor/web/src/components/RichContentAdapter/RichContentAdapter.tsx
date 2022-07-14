/* eslint-disable brace-style */
import type { Editor, JSONContent } from '@tiptap/react';
import { capitalize } from 'lodash';
import type { Fragment, Node as ProseMirrorNode } from 'prosemirror-model';
import type { RicosEditorProps } from 'ricos-common';
import {
  BLOCKQUOTE,
  BULLET_LIST_TYPE,
  CODE_BLOCK_TYPE,
  generateId,
  HEADER_BLOCK,
  NUMBERED_LIST_TYPE,
  UNSTYLED,
} from 'ricos-content';
import { tiptapToDraft } from 'ricos-converters';
import { Decoration_Type, Node_Type } from 'ricos-schema';
import type { TiptapAdapter } from 'ricos-tiptap-types';
import type { EditorContextType, Pubsub, RicosServices } from 'ricos-types';
import type { RicosCustomStyles, TextAlignment } from 'wix-rich-content-common';
import {
  defaultFontSizes,
  defaultMobileFontSizes,
  DOC_STYLE_TYPES,
  RICOS_LINK_TYPE,
  RICOS_ANCHOR_TYPE,
  RICOS_MENTION_TYPE,
  RICOS_TEXT_COLOR_TYPE,
  RICOS_TEXT_HIGHLIGHT_TYPE,
} from 'wix-rich-content-common';
import { TO_TIPTAP_TYPE } from '../../consts';
import { findNodeById } from '../../helpers';

export class RichContentAdapter implements TiptapAdapter {
  private readonly initialContent: Fragment;

  private readonly shouldRevealConverterErrors: boolean | undefined;

  getToolbarProps: TiptapAdapter['getToolbarProps'];

  constructor(
    public tiptapEditor: Editor,
    ricosEditorProps: RicosEditorProps,
    services: RicosServices
  ) {
    this.tiptapEditor = tiptapEditor;
    this.initialContent = this.tiptapEditor.state.doc.content;
    this.getEditorCommands = this.getEditorCommands.bind(this);
    this.shouldRevealConverterErrors =
      ricosEditorProps.experiments?.removeRichContentSchemaNormalizer?.enabled;
    this.getToolbarProps = type => ({
      buttons: services.plugins
        .getAddButtons()
        .asArray()
        .reduce((acc, b) => {
          return {
            ...acc,
            [b.getButton().id]: b.toExternalToolbarButtonConfig(
              this.getEditorCommands(),
              services.t,
              //TODO: pass UploadService
              //@ts-ignore
              {},
              {}
            ),
          };
        }, {}),
      context: {} as EditorContextType,
      pubsub: {} as Pubsub,
    });
  }

  isContentChanged = (): boolean => !this.initialContent.eq(this.tiptapEditor.state.doc.content);

  getContainer = () => {
    return this.tiptapEditor?.options?.element;
  };

  getDraftContent = () =>
    tiptapToDraft(this.tiptapEditor.getJSON() as JSONContent, this.shouldRevealConverterErrors);

  focus() {
    this.tiptapEditor.commands.focus();
  }

  blur() {
    this.tiptapEditor.commands.blur();
  }

  getEditorCommands() {
    return {
      ...this.editorMocks,
      toggleInlineStyle: inlineStyle => {
        const editorCommand = this.tiptapEditor.chain().focus();
        const styleName = `toggle${capitalize(inlineStyle)}`;
        editorCommand[styleName]().run();
      },
      hasInlineStyle: style => {
        const {
          state: {
            doc,
            selection: { from, to, $from },
          },
        } = this.tiptapEditor;

        const marks = {};
        if (from === to) {
          $from.nodeBefore?.marks.forEach(({ type: { name } }) => {
            marks[name] = true;
          });
        } else {
          doc.nodesBetween(from, to, node => {
            node.marks.forEach(({ type: { name } }) => {
              marks[name] = true;
            });
          });
        }

        return marks[style];
      },
      insertBlock: (pluginType, data) => {
        const type = TO_TIPTAP_TYPE[pluginType];
        let id = '';
        if (type) {
          const { content, ..._attrs } = data;
          id = data.id || generateId();
          const attrs = { id, ...flatComponentState(_attrs) };
          this.tiptapEditor.chain().focus().insertContent([{ type, attrs, content }]).run();
        } else {
          console.error(`No such plugin type ${pluginType}`);
        }
        return id;
      },
      insertBlockWithBlankLines: (pluginType, data, settings = { updateSelection: true }) => {
        const type = TO_TIPTAP_TYPE[pluginType];
        let id = '';
        if (type) {
          const { content, ..._attrs } = data;
          id = data.id || generateId();
          const attrs = { id, ...flatComponentState(_attrs) };
          const {
            state: {
              selection: { to: lastNodePosition },
            },
          } = this.tiptapEditor;
          const { updateSelection } = settings;
          this.tiptapEditor
            .chain()
            .focus()
            .insertContent([
              { type: 'PARAGRAPH', attrs: { id: generateId() } },
              { type, attrs, content },
              { type: 'PARAGRAPH', attrs: { id: generateId() } },
            ])
            .setNodeSelection(updateSelection ? lastNodePosition + 1 : lastNodePosition + 2)
            .run();
        } else {
          console.error(`No such plugin type ${pluginType}`);
        }
        return id;
      },
      deleteBlock: blockKey => {
        return this.tiptapEditor.commands.deleteNode(blockKey);
      },
      findNodeByKey() {},
      setBlock: (blockKey, pluginType, data) => {
        return this.tiptapEditor.commands.setNodeAttrsById(blockKey, flatComponentState(data));
      },
      updateBlock: (blockKey, pluginType, data) => {
        return this.tiptapEditor.commands.updateNodeAttrsById(blockKey, flatComponentState(data));
      },
      getSelection: () => {
        const {
          state: {
            doc,
            selection: { from, to },
          },
        } = this.tiptapEditor;

        const selectedNodes: ProseMirrorNode[] = [];
        doc.nodesBetween(from, to, node => {
          selectedNodes.push(node);
        });
        return {
          isFocused: this.tiptapEditor.isFocused,
          isCollapsed: this.tiptapEditor.state.selection.empty,
          startKey: selectedNodes[0].attrs.id,
          endKey: selectedNodes[selectedNodes.length - 1].attrs.id,
        };
      },

      insertDecoration: (type, data) => {
        const decorationCommandMap = {
          [RICOS_LINK_TYPE]: data => ({ command: 'setLink', args: { link: data } }),
          [RICOS_ANCHOR_TYPE]: data => ({ command: 'setAnchor', args: data.anchor }),
          [RICOS_TEXT_COLOR_TYPE]: data => ({ command: 'setColor', args: data.color }),
          [RICOS_TEXT_HIGHLIGHT_TYPE]: data => ({ command: 'setHighlight', args: data.color }),
          [RICOS_MENTION_TYPE]: data => ({ command: 'insertMention', args: data.mention }),
        };
        if (decorationCommandMap[type]) {
          const { command, args } = decorationCommandMap[type](data);
          const editorCommand = this.tiptapEditor.chain().focus();
          editorCommand[command](args).run();
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
        } = this.tiptapEditor;

        const marks: Record<string, boolean> = {};
        doc.nodesBetween(from, to, node => {
          node.marks.forEach(({ type: { name } }) => {
            marks[name] = true;
          });
        });
        return marks[Decoration_Type.LINK] || marks[Decoration_Type.ANCHOR];
      },

      getLinkDataInSelection: () => {
        const {
          state: {
            doc,
            selection: { from, to },
          },
        } = this.tiptapEditor;

        let link;
        doc.nodesBetween(from, to, node => {
          node.marks.forEach(mark => {
            const {
              type: { name },
            } = mark;
            if (name === Decoration_Type.LINK) {
              link = mark.attrs.link;
            } else if (name === Decoration_Type.ANCHOR) {
              link = { anchor: mark.attrs.anchor };
            }
          });
        });
        return link;
      },
      setBlockType: type => {
        const blockTypeCommandMap = {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [UNSTYLED]: () => this.tiptapEditor.commands.setParagraph(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [HEADER_BLOCK.ONE]: () => this.tiptapEditor.commands.toggleHeading({ level: 1 }),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [HEADER_BLOCK.TWO]: () => this.tiptapEditor.commands.toggleHeading({ level: 2 }),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [HEADER_BLOCK.THREE]: () => this.tiptapEditor.commands.toggleHeading({ level: 3 }),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [HEADER_BLOCK.FOUR]: () => this.tiptapEditor.commands.toggleHeading({ level: 4 }),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [HEADER_BLOCK.FIVE]: () => this.tiptapEditor.commands.toggleHeading({ level: 5 }),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [HEADER_BLOCK.SIX]: () => this.tiptapEditor.commands.toggleHeading({ level: 6 }),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [BLOCKQUOTE]: () => this.tiptapEditor.commands.toggleBlockquote(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [CODE_BLOCK_TYPE]: () => this.tiptapEditor.commands.toggleCodeBlock(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [BULLET_LIST_TYPE]: () => this.tiptapEditor.commands.toggleBulletList(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [NUMBERED_LIST_TYPE]: () => this.tiptapEditor.commands.toggleOrderedList(),
        };
        const currentSetBlockTypeCommand = blockTypeCommandMap[type];
        if (currentSetBlockTypeCommand) {
          currentSetBlockTypeCommand();
        } else {
          throw new Error(`${type} block type not supported`);
        }
      },
      isBlockTypeSelected: type => {
        const blockTypeActiveCommandMap = {
          [UNSTYLED]: () => this.tiptapEditor.isActive('unstyled'),
          [HEADER_BLOCK.ONE]: () => this.tiptapEditor.isActive(Node_Type.HEADING, { level: 1 }),
          [HEADER_BLOCK.TWO]: () => this.tiptapEditor.isActive(Node_Type.HEADING, { level: 2 }),
          [HEADER_BLOCK.THREE]: () => this.tiptapEditor.isActive(Node_Type.HEADING, { level: 3 }),
          [HEADER_BLOCK.FOUR]: () => this.tiptapEditor.isActive(Node_Type.HEADING, { level: 4 }),
          [HEADER_BLOCK.FIVE]: () => this.tiptapEditor.isActive(Node_Type.HEADING, { level: 5 }),
          [HEADER_BLOCK.SIX]: () => this.tiptapEditor.isActive(Node_Type.HEADING, { level: 6 }),
          [CODE_BLOCK_TYPE]: () => this.tiptapEditor.isActive(Node_Type.CODE_BLOCK),
          [BLOCKQUOTE]: () => this.tiptapEditor.isActive(Node_Type.BLOCKQUOTE),
          [NUMBERED_LIST_TYPE]: () => this.tiptapEditor.isActive(Node_Type.ORDERED_LIST),
          [BULLET_LIST_TYPE]: () => this.tiptapEditor.isActive(Node_Type.BULLETED_LIST),
        };
        const currentBlockTypeActiveCommand = blockTypeActiveCommandMap[type];

        if (currentBlockTypeActiveCommand) {
          return currentBlockTypeActiveCommand();
        } else {
          throw new Error(`${type} block type not supported`);
        }
      },
      deleteDecoration: type => {
        const deleteDecorationCommandMap = {
          [RICOS_LINK_TYPE]: () => this.tiptapEditor.commands.unsetLink(),
        };
        if (deleteDecorationCommandMap[type]) {
          deleteDecorationCommandMap[type]();
        } else {
          console.error(`delete ${type} decoration type not supported`);
        }
      },
      setTextAlignment: alignment => {
        this.tiptapEditor.commands.setTextAlign(alignment);
      },
      undo: () => this.tiptapEditor.commands.undo(),
      redo: () => this.tiptapEditor.commands.redo(),
      insertText: text =>
        this.tiptapEditor
          .chain()
          .focus()
          .command(({ tr }) => {
            tr.insertText(text);
            return true;
          })
          .run(),

      getAllBlocksKeys: () => {
        const keys: string[] = [];
        this.tiptapEditor.state.doc.descendants((node: ProseMirrorNode) => {
          keys.push(node.attrs.id);
        });

        return keys;
      },
      getBlockComponentData: id => {
        const nodesWithPos = findNodeById(this.tiptapEditor.state.tr, id);
        if (nodesWithPos[0]) {
          const { node } = nodesWithPos[0];
          return node.attrs;
        } else {
          console.error('Failed to find node and return its data');
        }
      },
    };
  }

  editorMocks = {
    getAnchorableBlocks: () => ({
      anchorableBlocks: [],
      pluginsIncluded: [],
    }),
    getColor: () => 'unset',
    getFontSize: () => 'big',
    getTextAlignment: (): TextAlignment => {
      const {
        state: {
          doc,
          selection: { from, to },
        },
      } = this.tiptapEditor;

      const textStyles: string[] = [];
      doc.nodesBetween(from, to, node => {
        const textAlignment = node.attrs?.textStyle?.textAlignment;
        if (textAlignment) {
          textStyles.push(textAlignment);
        }
      });
      let currentTextStyle = 'auto';
      if (textStyles[0]) {
        currentTextStyle = textStyles[0].toLowerCase();
      }
      return currentTextStyle as TextAlignment;
    },
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
    setBlockType: () => {},
    _setSelection: () => {},
    getDocumentStyle: () => undefined,
    getAnchorBlockInlineStyles: () => {
      return {};
    },
    getInlineStylesInSelection: () => {
      return {};
    },
    updateDocumentStyle: () => {},
    clearSelectedBlocksInlineStyles: () => {},
    getWiredFontStyles: (customStyles?: RicosCustomStyles, isMobile?: boolean) => {
      const fontStyles = {};
      Object.values(DOC_STYLE_TYPES).forEach((docType: string) => {
        fontStyles[docType] = {
          'font-size': isMobile ? defaultMobileFontSizes[docType] : defaultFontSizes[docType],
          'font-family': 'HelveticaNeue, Helvetica, Arial',
        };
      });
      return fontStyles;
    },
    isAtomicBlockInSelection: () => false,
    isTextBlockInSelection: () => true,
    getAnchorBlockType: () => 'paragraph',
    focus: () => {},
  };
}

const flatComponentState = data => {
  const { componentState, ...rest } = data;
  return { ...(rest || {}), ...(componentState || {}) };
};
