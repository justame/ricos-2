/* eslint-disable brace-style */
import type { Editor, JSONContent } from '@tiptap/react';
import { capitalize } from 'lodash';
import type { Fragment, Node as ProseMirrorNode } from 'prosemirror-model';
import type { RicosEditorProps } from 'ricos-common';
import type { ParagraphNode, HeadingNode } from 'ricos-content';
import {
  RICOS_LINE_SPACING_TYPE,
  BLOCKQUOTE,
  BULLET_LIST_TYPE,
  CODE_BLOCK_TYPE,
  generateId,
  HEADER_BLOCK,
  NUMBERED_LIST_TYPE,
  RICOS_INDENT_TYPE,
  UNSTYLED,
  getTextDirection,
} from 'ricos-content';
import { tiptapToDraft, fromTiptapNode } from 'ricos-converters';
import { Decoration_Type, Node_Type } from 'ricos-schema';
import type { Node } from 'ricos-schema';
import type {
  TiptapAdapter,
  EditorContextType,
  Pubsub,
  ColorType,
  EditorCommands,
} from 'ricos-types';
import { ToolbarType } from 'ricos-types';
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
  RICOS_FONT_SIZE_TYPE,
} from 'wix-rich-content-common';
import { TO_TIPTAP_TYPE } from '../../consts';
import { findNodeById } from '../../helpers';
import { convertInlineStylesToCSS } from '../../helpers/convertInlineStylesToCss';
import type { TiptapAdapterServices } from '../../initializeTiptapAdapter';
import { resolversById } from 'wix-rich-content-toolbars-v3';
import { RESOLVERS_IDS } from 'wix-rich-content-toolbars-v3/libs/resolvers-ids';

export class RichContentAdapter implements TiptapAdapter {
  private readonly initialContent: Fragment;

  private readonly shouldRevealConverterErrors: boolean | undefined;

  getToolbarProps: TiptapAdapter['getToolbarProps'];

  private readonly services: TiptapAdapterServices;

  constructor(
    public tiptapEditor: Editor,
    ricosEditorProps: RicosEditorProps,
    services: TiptapAdapterServices
  ) {
    this.tiptapEditor = tiptapEditor;
    this.initialContent = this.tiptapEditor.state.doc.content;
    this.getEditorCommands = this.getEditorCommands.bind(this);
    this.shouldRevealConverterErrors =
      ricosEditorProps.experiments?.removeRichContentSchemaNormalizer?.enabled;
    this.getToolbarProps = type => {
      const buttons =
        type === ToolbarType.INSERT_PLUGIN
          ? services.plugins.getAddButtons()
          : services.plugins.getTextButtons();
      return {
        buttons: buttons.toExternalToolbarButtonsConfigs(this.getEditorCommands()),
        context: {} as EditorContextType,
        pubsub: {} as Pubsub,
      };
    };
    this.services = services;
  }

  private getSelectedColors(type: 'foreground' | 'background') {
    const {
      state: {
        doc,
        selection: { from, to },
      },
    } = this.tiptapEditor;

    const selectedColors: string[] = [];

    doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === 'text') {
        const color = node.marks.find(mark => mark.type.name === Decoration_Type.COLOR)?.attrs[
          type
        ];
        if (color) {
          selectedColors.push(color);
        } else {
          const parent = doc.resolve(pos).parent;
          if (parent.type.name === Node_Type.PARAGRAPH || parent.type.name === Node_Type.HEADING) {
            const ricosNode = fromTiptapNode({ ...parent.toJSON(), type: parent?.type?.name });
            const decoration = this.services.styles.getDecoration(
              ricosNode as ParagraphNode | HeadingNode,
              Decoration_Type.COLOR
            );
            const colorInStyles = decoration.colorData?.[type];
            if (colorInStyles) {
              selectedColors.push(colorInStyles);
            }
          }
        }
      }
    });
    return selectedColors.every(color => color === selectedColors[0]) ? selectedColors[0] : '';
  }

  isContentChanged = (): boolean => !this.initialContent.eq(this.tiptapEditor.state.doc.content);

  getContainer = () => {
    return this.tiptapEditor?.options?.element;
  };

  getDraftContent = () =>
    tiptapToDraft(this.tiptapEditor.getJSON() as JSONContent, this.shouldRevealConverterErrors);

  getDocumentStyle = () => this.tiptapEditor?.getJSON()?.attrs?.documentStyle || {};

  focus() {
    this.tiptapEditor.commands.focus();
  }

  blur() {
    this.tiptapEditor.commands.blur();
  }

  getEditorCommands(): EditorCommands {
    const hasInlineStyle: EditorCommands['hasInlineStyle'] = style => {
      const resolvedStyles = {
        bold: this.services.content.resolve(resolversById[RESOLVERS_IDS.IS_TEXT_CONTAINS_BOLD]),
        italic: this.services.content.resolve(resolversById[RESOLVERS_IDS.IS_TEXT_CONTAINS_ITALIC]),
        underline: this.services.content.resolve(
          resolversById[RESOLVERS_IDS.IS_TEXT_CONTAINS_UNDERLINE]
        ),
        spoiler: this.services.content.resolve(
          resolversById[RESOLVERS_IDS.IS_TEXT_CONTAINS_SPOILER]
        ),
      };
      return resolvedStyles[style];
    };

    return {
      ...this.editorMocks,
      toggleInlineStyle: inlineStyle => {
        const editorCommand = this.tiptapEditor.chain();
        const styleName = `toggle${capitalize(inlineStyle)}`;
        editorCommand[styleName]().run();
      },
      hasInlineStyle,
      insertBlock: (pluginType: string, data = {}) => {
        const type = TO_TIPTAP_TYPE[pluginType];
        let id = '';
        if (type) {
          const { content, ..._attrs } = data;
          id = data.id || generateId();
          const attrs = { id, ...flatComponentState(_attrs) };
          this.tiptapEditor.chain().focus().insertContent([{ type, attrs, content }]).run();
          this.services.pluginsEvents.publishPluginAddSuccess({
            pluginId: type,
            params: { ...attrs },
          });
        } else {
          console.error(`No such plugin type ${pluginType}`);
        }
        return id;
      },
      insertBlockWithBlankLines: (
        pluginType: string,
        data = {},
        settings = { updateSelection: true }
      ) => {
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
          this.services.pluginsEvents.publishPluginAddSuccess({
            pluginId: type,
            params: { ...attrs },
          });
        } else {
          console.error(`No such plugin type ${pluginType}`);
        }
        return id;
      },
      deleteBlock: blockKey => {
        return this.tiptapEditor.commands.deleteNode(blockKey);
      },
      setBlock: (blockKey, pluginType, data) => {
        return this.tiptapEditor.commands.setNodeAttrsById(blockKey, flatComponentState(data));
      },
      updateBlock: (blockKey, pluginType, data) => {
        return this.tiptapEditor.commands.updateNodeAttrsById(blockKey, flatComponentState(data));
      },
      getColor: (colorType: ColorType) =>
        this.getSelectedColors(colorType === 'ricos-text-color' ? 'foreground' : 'background'),

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
        const hasSelectionNodes = selectedNodes.length > 0;
        return {
          isFocused: this.tiptapEditor.isFocused,
          isCollapsed: this.tiptapEditor.state.selection.empty,
          startKey: hasSelectionNodes ? selectedNodes[0].attrs.id : '',
          endKey: hasSelectionNodes ? selectedNodes[selectedNodes.length - 1].attrs.id : '',
        };
      },

      insertDecoration: (type: string, data, settings) => {
        const decorationCommandMap = {
          [RICOS_LINK_TYPE]: data => ({ command: 'setLink', args: { link: data } }),
          [RICOS_ANCHOR_TYPE]: data => ({ command: 'setAnchor', args: data }),
          [RICOS_TEXT_COLOR_TYPE]: data => ({ command: 'setColor', args: data.color }),
          [RICOS_TEXT_HIGHLIGHT_TYPE]: data => ({ command: 'setHighlight', args: data.color }),
          [RICOS_MENTION_TYPE]: data => ({ command: 'insertMention', args: data.mention }),
          [RICOS_INDENT_TYPE]: () => ({ command: 'indent', args: undefined }),
          [RICOS_FONT_SIZE_TYPE]: data => ({
            command: 'setFontSize',
            args: parseInt(data.fontSize, 10),
          }),
          [RICOS_LINE_SPACING_TYPE]: data => ({ command: 'setLineSpacings', args: data.data }),
        };
        if (decorationCommandMap[type]) {
          const { command, args } = decorationCommandMap[type](data);
          const editorCommand = settings?.shouldFocus
            ? this.tiptapEditor.chain().focus()
            : this.tiptapEditor.chain();
          editorCommand[command](args).run();
          this.services.pluginsEvents.publishPluginAddSuccess({
            pluginId: type,
            params: { ...args },
          });
        } else {
          console.error(`${type} decoration not supported`);
        }
      },
      getFontSize: () => {
        const {
          state: {
            doc,
            selection: { from, to },
          },
        } = this.tiptapEditor;

        const selectedFontSizes: string[] = [];

        doc.nodesBetween(from, to, (node, pos) => {
          if (node.type.name === 'text') {
            const fontSizeMark = node.marks.find(
              mark => mark.type.name === Decoration_Type.FONT_SIZE
            );
            if (fontSizeMark) {
              selectedFontSizes.push(`${fontSizeMark?.attrs.value}`);
            } else {
              const parent = doc.resolve(pos).parent;
              if (
                parent.type.name === Node_Type.PARAGRAPH ||
                parent.type.name === Node_Type.HEADING
              ) {
                const ricosNode = fromTiptapNode({ ...parent.toJSON(), type: parent?.type?.name });
                const decoration = this.services.styles.getDecoration(
                  ricosNode as ParagraphNode | HeadingNode,
                  Decoration_Type.FONT_SIZE
                );
                if (decoration.fontSizeData?.value) {
                  const fontSizeInDocumentStyle = decoration.fontSizeData?.value;
                  selectedFontSizes.push(`${fontSizeInDocumentStyle}`);
                }
              }
            }
          }
        });
        return selectedFontSizes.every(fontSize => fontSize === selectedFontSizes[0])
          ? selectedFontSizes[0]
          : '';
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
          [UNSTYLED]: () => this.tiptapEditor.chain().focus().setParagraph().run(),
          [HEADER_BLOCK.ONE]: () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.tiptapEditor.chain().focus().toggleHeading({ level: 1 }).run(),
          [HEADER_BLOCK.TWO]: () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.tiptapEditor.chain().focus().toggleHeading({ level: 2 }).run(),
          [HEADER_BLOCK.THREE]: () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.tiptapEditor.chain().focus().toggleHeading({ level: 3 }).run(),
          [HEADER_BLOCK.FOUR]: () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.tiptapEditor.chain().focus().toggleHeading({ level: 4 }).run(),
          [HEADER_BLOCK.FIVE]: () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.tiptapEditor.chain().focus().toggleHeading({ level: 5 }).run(),
          [HEADER_BLOCK.SIX]: () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.tiptapEditor.chain().focus().toggleHeading({ level: 6 }).run(),
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
      deleteDecoration: (type: string) => {
        const deleteDecorationCommandMap = {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [RICOS_LINK_TYPE]: () => this.tiptapEditor.commands.unsetLink(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [RICOS_ANCHOR_TYPE]: () => this.tiptapEditor.commands.unsetAnchor(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [RICOS_INDENT_TYPE]: () => this.tiptapEditor.commands.outdent(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [RICOS_TEXT_COLOR_TYPE]: () => this.tiptapEditor.commands.unsetColor(),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [RICOS_TEXT_HIGHLIGHT_TYPE]: () => this.tiptapEditor.commands.unsetHighlight(),
        };
        if (deleteDecorationCommandMap[type]) {
          deleteDecorationCommandMap[type]();
          this.services.pluginsEvents.publishPluginDelete({ pluginId: type });
        } else {
          console.error(`delete ${type} decoration type not supported`);
        }
      },
      setTextAlignment: (alignment: TextAlignment) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.tiptapEditor.chain().focus().setTextAlign(alignment).run();
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      undo: () => this.tiptapEditor.chain().focus().undo().run(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      redo: () => this.tiptapEditor.chain().focus().redo().run(),
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

      resetDocumentStyleByNodeType: nodeType => {
        this.tiptapEditor
          .chain()
          .focus()
          .unsetAllMarks()
          .resetDocumentStyleByNodeType(nodeType)
          .run();
      },
      updateDocumentStyle: _documentStyles => {
        this.tiptapEditor.commands.updateDocumentStyleBySelectedNode();
      },
      clearSelectedBlocksInlineStyles: () => {
        this.tiptapEditor.commands.unsetAllMarks();
      },

      getCurrentHeading: () => {
        return this.services.content.resolve(resolversById[RESOLVERS_IDS.GET_HEADING_IN_SELECTION]);
      },
      triggerDecoration: type => {
        const triggerDecorationsMap = {
          [RICOS_MENTION_TYPE]: () =>
            this.tiptapEditor
              .chain()
              .focus()
              .command(({ tr }) => {
                tr.insertText(' @');
                return true;
              })
              .run(),
        };
        triggerDecorationsMap[type]?.();
      },
    };
  }

  editorMocks = {
    getAnchorableBlocks: () => ({
      anchorableBlocks: [],
      pluginsIncluded: [],
    }),
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
      if (currentTextStyle === 'auto') {
        const selectedFirstNodeText = doc.nodeAt(from - 1)?.textContent;
        const selectedFirstNodeDirection = getTextDirection(selectedFirstNodeText);
        currentTextStyle = selectedFirstNodeDirection === 'rtl' ? 'right' : 'left';
      }
      return currentTextStyle as TextAlignment;
    },
    isBlockTypeSelected: () => false,
    isUndoStackEmpty: () =>
      this.services.content.resolve(resolversById[RESOLVERS_IDS.IS_UNDO_STACK_EMPTY]),
    isRedoStackEmpty: () =>
      this.services.content.resolve(resolversById[RESOLVERS_IDS.IS_REDO_STACK_EMPTY]),
    getSelectedData: () => 'blah',
    getPluginsList: () => [],
    scrollToBlock: _blockKey => {},
    isBlockInContent: _blockKey => false,
    toggleBlockOverlay: _blockKey => false,
    getBlockSpacing: () => {
      const lineHeight = this.services.content.resolve(
        resolversById[RESOLVERS_IDS.GET_LINE_SPACING_IN_SELECTION]
      );
      const paddingTop = this.services.content.resolve(
        resolversById[RESOLVERS_IDS.GET_LINE_SPACING_BEFORE_SELECTION]
      );
      const paddingBottom = this.services.content.resolve(
        resolversById[RESOLVERS_IDS.GET_LINE_SPACING_AFTER_SELECTION]
      );
      return {
        'line-height': lineHeight,
        'padding-top': paddingTop,
        'padding-bottom': paddingBottom,
      };
    },
    saveEditorState: () => {},
    loadEditorState: () => {},
    saveSelectionState: () => {},
    loadSelectionState: () => {},
    setBlockType: () => {},
    _setSelection: () => {},
    getDocumentStyle: () => undefined,
    getAnchorBlockInlineStyles: () => {
      return {};
    },
    getInlineStylesInSelection: () => {
      const {
        state: {
          doc,
          selection: { from, to },
        },
      } = this.tiptapEditor;

      let node: Node | undefined;
      doc.nodesBetween(from, to, currNode => {
        if (
          [Node_Type.PARAGRAPH as string, Node_Type.HEADING as string].includes(
            currNode?.type?.name
          )
        ) {
          node = fromTiptapNode({ ...currNode.toJSON(), type: currNode?.type?.name });
          return false;
        }
      });
      return node ? convertInlineStylesToCSS(node) : {};
    },
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
