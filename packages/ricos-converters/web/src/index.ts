import type { JSONContent } from '@tiptap/core';
import { flow, identity, pipe } from 'fp-ts/function';
import type { DraftContent } from 'ricos-content';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
import { convertNodeDataToDraft } from 'ricos-content/libs/convertNodeDataToDraft';
import { TO_RICOS_NODE_TYPE } from 'ricos-content/libs/draftConsts';
import { fromDraft } from 'ricos-content/libs/fromDraft';
import { toDraft } from 'ricos-content/libs/toDraft';
import type { Node, Node_Type } from 'ricos-schema';
import { RichContent } from 'ricos-schema';
import toCamelCase from 'to-camel-case';
import { fromTiptap, fromTiptapNode, toTiptap, toTiptapNodeAttrs } from './tiptap-converters';
import type { TiptapNode } from './types';
export * from './types';
export { fromTiptap, toTiptap, fromTiptapNode };

const normalizeRichContent = flow(RichContent.fromJSON, RichContent.toJSON);

const normalizeTiptap = flow(JSON.stringify, JSON.parse);

export const draftToTiptap = flow(fromDraft, normalizeTiptap, toTiptap);

export const tiptapNodeDataToDraft = (
  nodeType: Node_Type,
  nodeData: TiptapNode['attrs']
): Record<string, unknown> => {
  const node = fromTiptapNode({ type: nodeType, attrs: nodeData });
  const { id: _, type, nodes, style: _s, ...data } = node;
  const dataValue = data[Object.keys(data)[0]];
  return convertNodeDataToDraft(type, dataValue, nodes);
};

type DraftBlockData = {
  type: string;
  data: Record<string, unknown>;
};

const toDraftBlockData = (type: string, data: Record<string, unknown>) => ({ type, data });

const toRichContentNode = (block: DraftBlockData): Node => {
  const type = TO_RICOS_NODE_TYPE[block.type] as Node_Type;
  const dataType = `${toCamelCase(type)}Data`;
  return {
    [dataType]: { ...convertBlockDataToRicos(block.type, block.data) },
    type,
    id: '',
    nodes: [],
  };
};

export const draftBlockDataToTiptap = (
  blockType: string,
  draftBlockData: Record<string, unknown>
): TiptapNode['attrs'] =>
  pipe(
    toDraftBlockData(blockType, draftBlockData),
    toRichContentNode,
    toTiptapNodeAttrs,
    normalizeTiptap
  );

const normalize = (shouldNormalize: boolean) => (shouldNormalize ? normalizeRichContent : identity);

export const tiptapToDraft = (
  proseContent: JSONContent,
  shouldRevealConverterErrors = false
): DraftContent => pipe(proseContent, fromTiptap, normalize(!shouldRevealConverterErrors), toDraft);
