/* eslint-disable no-console */
import type { DraftBlockType } from 'draft-js';
import { pipe } from 'fp-ts/function';
import { merge } from 'lodash';
import type { Node, RichContent, TextNodeStyle } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import { v4 as uuid } from 'uuid';
import { RICOS_NODE_TYPE_TO_DATA_FIELD } from '../../../consts';
import type { DraftContent, RicosContentBlock } from '../../../types';
import { Version } from '../../../version';
import { generateId } from '../../generateRandomId';
import { BlockType, HeaderLevel, TO_DRAFT_LIST_TYPE } from '../consts';
import {
  convertDocumentStyleDecorationTypes,
  getParagraphNode,
  mergeTextNodes,
  parseDecorations,
  parseEntityDecorations,
  parseInlineStyleDecorations,
} from './decorationParsers';
import { createAtomicEntityData, createTextBlockData } from './getDraftEntityData';
import preprocess from './preprocess';

const parseDocStyle = documentStyle => {
  const draftDocStyle = {};
  Object.entries(documentStyle).forEach(([header, values]) => {
    if (values) {
      const { decorations = [], nodeStyle, lineHeight } = values as TextNodeStyle;
      draftDocStyle[header as string] = {
        ...convertDocumentStyleDecorationTypes(decorations),
        ...convertNodeStyleToCss({ ...nodeStyle, lineHeight }),
      };
    }
  });
  return draftDocStyle;
};

const convert =
  (options = { ignoreUnsupportedTypes: false }) =>
  (ricosContent: RichContent): DraftContent => {
    const { nodes, documentStyle } = ricosContent;

    const draftContent: DraftContent = {
      blocks: [],
      entityMap: {},
    };
    let latestEntityKey = -1;
    const usedKeys: Record<string, boolean> = {};

    const parseNodes = (index = 0) => {
      const node = nodes[index];
      if (node) {
        switch (node.type) {
          case Node_Type.BLOCKQUOTE:
            parseTextNodes(getParagraphNode(node), {
              type: BlockType.Blockquote,
              key: node.id,
              indentation: node.blockquoteData?.indentation,
            });
            break;
          case Node_Type.CODE_BLOCK:
            parseTextNodes(node, { type: BlockType.CodeBlock, key: node.id });
            break;
          case Node_Type.HEADING:
            if (!node.headingData) {
              throw Error(`ERROR! Heading node with no data!`);
            }
            parseTextNodes(node, { type: HeaderLevel[node.headingData.level], key: node.id });
            break;
          case Node_Type.ORDERED_LIST:
          case Node_Type.BULLETED_LIST:
            parseListNode(node);
            break;
          case Node_Type.PARAGRAPH:
            parseTextNodes(node, { type: BlockType.Unstyled, key: node.id });
            break;
          default:
            if (RICOS_NODE_TYPE_TO_DATA_FIELD[node.type]) {
              parseAtomicNode(node);
            } else if (!options.ignoreUnsupportedTypes) {
              throw Error(`ERROR! Unknown node type "${node.type}"!`);
            }
        }
        parseNodes(index + 1);
      }
    };

    const parseAtomicNode = (node: Node) => {
      latestEntityKey += 1;
      const entityMap = createAtomicEntityData(node, latestEntityKey);
      addBlock({
        key: node.id,
        type: BlockType.Atomic,
        text: ' ',
        entityRanges: [{ offset: 0, length: 1, key: latestEntityKey }],
      });
      draftContent.entityMap = { ...draftContent.entityMap, ...entityMap };
    };

    const parseListNode = (node: Node, indentation = 0) => {
      node.nodes.forEach(listItem => {
        const [paragraph, childNode] = listItem.nodes;
        if (paragraph) {
          parseTextNodes(paragraph, {
            type: TO_DRAFT_LIST_TYPE[node.type],
            key: paragraph.id,
            indentation,
          });
        }
        if (childNode) {
          parseListNode(childNode, indentation + 1);
        }
      });
    };

    const parseTextNodes = (
      node: Node,
      { type, key, indentation }: { type: DraftBlockType; key: string; indentation?: number }
    ) => {
      const { text, decorationMap } = mergeTextNodes(node.nodes);
      const { inlineStyleDecorations, entityDecorations } = parseDecorations(decorationMap, text);
      const inlineStyleRanges = parseInlineStyleDecorations(inlineStyleDecorations);
      const {
        entityRanges,
        entityMap,
        latestEntityKey: newLatestEntityKey,
      } = parseEntityDecorations(entityDecorations, latestEntityKey);
      latestEntityKey = newLatestEntityKey;
      const { depth, ...data } = createTextBlockData(node);
      addBlock({
        key,
        type,
        text,
        depth: indentation || depth,
        inlineStyleRanges,
        entityRanges,
        data,
      });
      draftContent.entityMap = { ...draftContent.entityMap, ...entityMap };
    };

    const addBlock = (blockProps?: Partial<RicosContentBlock>) => {
      const newBlock: RicosContentBlock = merge(
        {
          key: generateId(),
          type: BlockType.Unstyled,
          text: '',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        blockProps
      );
      if (usedKeys[newBlock.key] && newBlock.key !== '') {
        throw Error(`ERROR! Duplicate block key "${newBlock.key}"!`);
      }
      usedKeys[newBlock.key] = true;
      draftContent.blocks = [...draftContent.blocks, newBlock];
    };

    const parseDocStyle = documentStyle => {
      const draftDocStyle = {};
      Object.entries(documentStyle).forEach(([header, values]) => {
        if (values) {
          const { decorations, nodeStyle, lineHeight } = values as TextNodeStyle;
          draftDocStyle[header as string] = {
            ...convertDocumentStyleDecorationTypes(decorations),
            ...convertNodeStyleToCss({ ...nodeStyle, lineHeight }),
          };
        }
      });
      return draftDocStyle;
    };

    parseNodes();
    documentStyle && (draftContent.documentStyle = parseDocStyle(documentStyle));
    draftContent.VERSION = Version.currentVersion;
    draftContent.ID = ricosContent.metadata?.id || uuid();
    return draftContent;
  };

const convertNodeStyleToCss = nodeStyle => {
  const css = {};
  nodeStyle.paddingTop && (css['padding-top'] = nodeStyle.paddingTop);
  nodeStyle.paddingBottom && (css['padding-bottom'] = nodeStyle.paddingBottom);
  nodeStyle.lineHeight && (css['line-height'] = nodeStyle.lineHeight);
  return css;
};

export const toDraft = (content: RichContent, options = { ignoreUnsupportedTypes: false }) =>
  pipe(content, preprocess, convert(options));

export const ensureDraftContent = (content: RichContent | DraftContent): DraftContent =>
  'nodes' in content ? toDraft(content) : content;

export { parseDocStyle };
