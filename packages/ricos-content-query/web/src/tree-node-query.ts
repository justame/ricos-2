import type { Node } from 'ricos-schema';
import type { Node as ProseNode } from 'prosemirror-model';
import { fromTiptapNode } from 'ricos-converters';
import type { ITreeNodeQuery } from 'ricos-types';

export class TreeNodeQuery implements ITreeNodeQuery {
  protected node: ProseNode;

  originalIndex: number;

  children: ITreeNodeQuery[];

  parent: ITreeNodeQuery | null;

  constructor(node: ProseNode, parent: ITreeNodeQuery | null, originalIndex: number) {
    this.node = node;
    this.children = [];
    this.parent = parent;
    this.originalIndex = originalIndex;
  }

  /**
   * It returns an array of all the descendants of the current node that match the predicate
   * @param predicate - (node: ITreeNodeQuery) => boolean
   * @returns An array of ITreeNodeQuery objects that match the predicate.
   */
  descendants(predicate: (node: ITreeNodeQuery) => boolean): ITreeNodeQuery[] {
    const descendants: ITreeNodeQuery[] = [];
    this.children.forEach(child => {
      if (predicate(child)) {
        descendants.push(child);
      }
      descendants.push(...child.descendants(predicate));
    });
    return descendants;
  }

  /**
   * The closest() method of the ITreeNodeQuery interface traverses the element and its parents
   *
   * The predicate is a function that takes a node and returns a boolean
   * @param predicate - (node: ITreeNodeQuery) => boolean
   * @returns The closest node that matches the predicate.
   */
  closest(predicate: (node: ITreeNodeQuery) => boolean): ITreeNodeQuery | null {
    if (predicate(this)) {
      return this;
    }
    if (this.parent) {
      return this.parent.closest(predicate);
    }
    return null;
  }

  isTextBlock(): boolean {
    return this.node.isTextblock;
  }

  isBlock(): boolean {
    return this.node.isBlock;
  }

  isText(): boolean {
    return this.node.isText;
  }

  type(): string {
    return this.toNode().type;
  }

  byIndex(index) {
    return this.children[index];
  }

  /**
   * It converts a Tiptap node to a Prosemirror node
   * @returns A Node object.
   */
  toNode(): Node {
    return fromTiptapNode(this.node.toJSON());
  }
}
