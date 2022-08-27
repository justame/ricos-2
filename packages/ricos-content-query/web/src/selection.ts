import type { ITreeNodeQuery, ISelection } from 'ricos-types';
import type { Editor } from '@tiptap/core';
import type { Decoration } from 'ricos-schema';
import type { Node as ProseNode } from 'prosemirror-model';

import { fromTiptapNode } from 'ricos-converters';
import { TreeNodeQuery } from './tree-node-query';

export class Selection implements ISelection {
  isEmpty: boolean;

  doc: ITreeNodeQuery;

  collapsedDecorations: Decoration[];

  constructor(private editor: Editor) {
    this.editor = editor;
    this.isEmpty = this.editor.state.selection.empty;
    this.doc = this.treeNode();
    this.collapsedDecorations = this.markToDecorations(this.editor.state.selection.$from.marks());
  }

  private buildTree(
    node: ProseNode,
    parent: ITreeNodeQuery | null = null,
    originalIndex,
    allSelectedNodes: Set<ProseNode>
  ) {
    const treeNode = new TreeNodeQuery(node, parent, originalIndex);

    if (allSelectedNodes.has(node)) {
      node.descendants((child, pos, parent, index) => {
        if (allSelectedNodes.has(child)) {
          treeNode.children.push(this.buildTree(child, treeNode, index, allSelectedNodes));
        }
        return false;
      });
    }
    return treeNode;
  }

  private treeNode(): TreeNodeQuery {
    const allSelectedNodes: Set<ProseNode> = new Set();
    const ranges = this.editor.state.selection.ranges;
    const state = this.editor.state;
    ranges.forEach(({ $from, $to }) => {
      const from = $from.pos;
      const to = $to.pos;

      state.doc.nodesBetween(from, to, node => {
        allSelectedNodes.add(node);
      });
    });

    const rootNode = this.editor.state.doc.copy(this.editor.state.doc.content);
    allSelectedNodes.add(rootNode);

    return this.buildTree(rootNode, null, 0, allSelectedNodes);
  }

  private markToDecorations(marks) {
    const dummyTextNode = this.editor.schema.text('dummyText', marks);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decorations = fromTiptapNode(dummyTextNode.toJSON() as any).textData?.decorations;
    return decorations || [];
  }
}
