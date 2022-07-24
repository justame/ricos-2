import type { JSONContent } from '@tiptap/core';
import { firstRight } from 'ricos-content';
import type { Metadata, Node, RichContent } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { ConvertableNode, Transforms, Tree } from './models/converter';
import {
  getUnsupportedFromTiptap,
  getUnsupportedToTiptap,
  nodeConverters,
} from './node-converters';
import { TiptapNodeBidiTransfoms } from './tiptap-node-transforms';
import type { TiptapNode } from './types';

const richContentTree: Tree<Node> = {
  getNodes: (root: Node) => root.nodes,
  setNodes: (nodes: Node[]) => ({ nodes }),
};

const tiptapTree: Tree<TiptapNode> = {
  getNodes: (root: TiptapNode) => root.content as TiptapNode[],
  setNodes: (content: TiptapNode[]) => ({ content }),
};

const transformNode =
  <SrcNode extends ConvertableNode, DestNode extends ConvertableNode>(
    srcTree: Tree<SrcNode>,
    destTree: Tree<DestNode>,
    transforms: Transforms<SrcNode, DestNode>
  ) =>
  (node: SrcNode): DestNode => {
    return transforms.byType(node).convert(node, visit(srcTree, destTree, transforms));
  };

const visit =
  <SrcNode extends ConvertableNode, DestNode extends ConvertableNode>(
    srcTree: Tree<SrcNode>,
    destTree: Tree<DestNode>,
    transforms: Transforms<SrcNode, DestNode>
  ) =>
  (node: SrcNode): DestNode[] =>
    (srcTree.getNodes(node) || []).map(transformNode(srcTree, destTree, transforms));

const convertTimestamp = (timestamp: unknown): string =>
  firstRight(timestamp, '', [
    [t => typeof t === 'string', t => t as string],
    [t => typeof (t as Date)?.toISOString === 'function', (t: Date) => t.toISOString()],
  ]);

const convertMetadata = (metadata: Metadata) => ({
  ...metadata,
  createdTimestamp: convertTimestamp(metadata.createdTimestamp),
  updatedTimestamp: convertTimestamp(metadata.updatedTimestamp),
});

export const tiptapNodeVisitor = visit(
  tiptapTree,
  richContentTree,
  new TiptapNodeBidiTransfoms(nodeConverters).fromTiptap()
);

export const ricosNodeVisitor = visit(
  richContentTree,
  tiptapTree,
  new TiptapNodeBidiTransfoms(nodeConverters).toTiptap()
);

export const toTiptap = (content: RichContent): JSONContent => {
  const ricosRoot = { id: 'root', type: Node_Type.UNRECOGNIZED, nodes: content.nodes };
  return {
    type: 'doc',
    ...tiptapTree.setNodes(ricosNodeVisitor(ricosRoot)),
    attrs: {
      metadata: convertMetadata(content.metadata || { version: 1 }),
      documentStyle: content.documentStyle || {},
    },
  };
};

export const toTiptapNodeAttrs = (node: Node): TiptapNode['attrs'] =>
  new TiptapNodeBidiTransfoms(nodeConverters)
    .toTiptap()
    .byType(node)
    .convert(node, ricosNodeVisitor).attrs;

export const fromTiptap = (content: JSONContent): RichContent => {
  return {
    metadata: content.attrs?.metadata,
    documentStyle: content.attrs?.documentStyle,
    ...richContentTree.setNodes(tiptapNodeVisitor(content as TiptapNode)),
  } as RichContent;
};

export const fromTiptapNode = (node: TiptapNode): Node => {
  const converter = nodeConverters.find(c => c.fromTiptap.type === node.type) || {
    fromTiptap: getUnsupportedFromTiptap(node),
  };
  return converter.fromTiptap.convert(node, tiptapNodeVisitor);
};

export const toTiptapNode = (node: Node): TiptapNode => {
  const converter = nodeConverters.find(c => c.toTiptap.type === node.type) || {
    toTiptap: getUnsupportedToTiptap(node),
  };
  return converter.toTiptap.convert(node, ricosNodeVisitor);
};
