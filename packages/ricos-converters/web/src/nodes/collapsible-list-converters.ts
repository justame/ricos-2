import type {
  CollapsibleItemBodyNode,
  CollapsibleItemNode,
  CollapsibleItemTitleNode,
  CollapsibleListNode,
} from 'ricos-content';
import type { CollapsibleListData, Node } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import type { TiptapNode, TiptapNodeConverter } from '../types';

export const collapsibleListConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.COLLAPSIBLE_LIST,
    convert: (node: CollapsibleListNode, visit: (node: CollapsibleListNode) => TiptapNode[]) => ({
      type: Node_Type.COLLAPSIBLE_LIST,
      attrs: {
        id: node.id,
        ...node.collapsibleListData,
      },

      content: visit(node),
    }),
  },
  fromTiptap: {
    type: Node_Type.COLLAPSIBLE_LIST,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id, ...data } = attrs;
      return {
        type: Node_Type.COLLAPSIBLE_LIST,
        id,
        nodes: visit(node),
        collapsibleListData: {
          ...(data as CollapsibleListData),
        },
      };
    },
  },
};

export const collapsibleItemConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.COLLAPSIBLE_ITEM,
    convert: (node: CollapsibleItemNode, visit: (node: CollapsibleItemNode) => TiptapNode[]) => ({
      type: Node_Type.COLLAPSIBLE_ITEM,
      attrs: {
        id: node.id,
      },
      content: visit(node),
    }),
  },
  fromTiptap: {
    type: Node_Type.COLLAPSIBLE_ITEM,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id } = attrs;
      return {
        type: Node_Type.COLLAPSIBLE_ITEM,
        id,
        nodes: visit(node),
      };
    },
  },
};

export const collapsibleItemTitleConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.COLLAPSIBLE_ITEM_TITLE,
    convert: (
      node: CollapsibleItemTitleNode,
      visit: (node: CollapsibleItemTitleNode) => TiptapNode[]
    ) => ({
      type: Node_Type.COLLAPSIBLE_ITEM_TITLE,
      attrs: {
        id: node.id,
      },
      content: visit(node),
    }),
  },
  fromTiptap: {
    type: Node_Type.COLLAPSIBLE_ITEM_TITLE,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id } = attrs;
      return {
        type: Node_Type.COLLAPSIBLE_ITEM_TITLE,
        id,
        nodes: visit(node),
      };
    },
  },
};

export const collapsibleItemBodyConverter: TiptapNodeConverter = {
  toTiptap: {
    type: Node_Type.COLLAPSIBLE_ITEM_BODY,
    convert: (
      node: CollapsibleItemBodyNode,
      visit: (node: CollapsibleItemBodyNode) => TiptapNode[]
    ) => ({
      type: Node_Type.COLLAPSIBLE_ITEM_BODY,
      attrs: {
        id: node.id,
      },
      content: visit(node),
    }),
  },
  fromTiptap: {
    type: Node_Type.COLLAPSIBLE_ITEM_BODY,
    convert: (node: TiptapNode, visit: (node: TiptapNode) => Node[]) => {
      const { attrs = {} } = node;
      const { id } = attrs;
      return {
        type: Node_Type.COLLAPSIBLE_ITEM_BODY,
        id,
        nodes: visit(node),
      };
    },
  },
};
