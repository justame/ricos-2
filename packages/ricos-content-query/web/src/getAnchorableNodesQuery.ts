import type { extract } from 'ricos-content/libs/extract';
import { Node_Type } from 'ricos-schema';
import type { Node } from 'ricos-schema';
import { and } from 'ricos-content';
import { not } from 'fp-ts/Predicate';

export const isAnchorableAtomicPluginNode = (node: Node): boolean => {
  const { type } = node;
  return (
    type === Node_Type.IMAGE ||
    type === Node_Type.GALLERY ||
    type === Node_Type.VIDEO ||
    type === Node_Type.MAP ||
    type === Node_Type.BUTTON ||
    type === Node_Type.GIF ||
    type === Node_Type.FILE
  );
};

const isAnchorableTextNode = (node: Node): boolean => {
  const { type } = node;
  return (
    type === Node_Type.PARAGRAPH ||
    type === Node_Type.BLOCKQUOTE ||
    type === Node_Type.CODE_BLOCK ||
    type === Node_Type.HEADING
  );
};

const isAnchorableNode = (node: Node): boolean => {
  return isAnchorableAtomicPluginNode(node) || isAnchorableTextNode(node);
};

const isEmptyTextNodes = (node: Node): boolean => {
  if (isAnchorableTextNode(node)) {
    const { nodes } = node;
    return nodes.length === 0;
  } else {
    return false;
  }
};

const isSelectedNode =
  (selectedNodeId: string) =>
  (node: Node): boolean => {
    const { id } = node;
    return selectedNodeId === id;
  };

export const getAnchorableNodesQuery = (
  contentExtractor: ReturnType<typeof extract>,
  selectedNodeId
): Node[] => {
  const anchorableNodes: Node[] = contentExtractor
    .filter(and([isAnchorableNode, not(isEmptyTextNodes), not(isSelectedNode(selectedNodeId))]))
    .get();

  return anchorableNodes;
};
