import { TIPTAP_COLLAPSIBLE_LIST_TYPE, TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE } from 'ricos-content';

//TODO: import this function from '@tiptap/core'
export function findParentNodeClosestToPos($pos, predicate) {
  // eslint-disable-next-line fp/no-loops
  for (let i = $pos.depth; i > 0; i -= 1) {
    const node = $pos.node(i);
    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node,
      };
    }
  }
}

export function isInCollapsibleList(editor) {
  return findParentNodeClosestToPos(
    editor.state.selection.$from,
    node => node.type.name === TIPTAP_COLLAPSIBLE_LIST_TYPE
  );
}

export function isInCollapsibleListBody(editor, nodeId) {
  return !!findParentNodeClosestToPos(
    editor.state.selection.$to,
    node => node.type.name === TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE && node.attrs.id === nodeId
  );
}

export function getCollapsibleListItems(state, nodeId) {
  const node = state.doc.content.content.find(node => node.attrs.id === nodeId);
  if (node.type.name === TIPTAP_COLLAPSIBLE_LIST_TYPE) {
    return node.content.content;
  }
  return [];
}

export function setCollapsibleItemsExpandState(items, commands, expandState) {
  items.forEach((node, index) => {
    const isExpanded = !!node.attrs.isExpanded;
    if (isExpanded !== (expandState === 'ALL' || (index === 0 && expandState === 'FIRST'))) {
      commands.updateNodeAttrsById(node.attrs.id, {
        isExpanded: !isExpanded,
      });
    }
  });
}

export const findContainerNode = (editor, nodeId) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collapsibleListNodes: Record<string, any>[] = [];
  editor.state.doc.descendants((node, _) => {
    if (node.type.name === TIPTAP_COLLAPSIBLE_LIST_TYPE) {
      collapsibleListNodes.push(node);
    }
  });
  const parentNode = collapsibleListNodes.find(currNode =>
    currNode.content.content.some(item => item.attrs.id === nodeId)
  );
  return parentNode;
};
