import type { Slice, Mark, Node } from 'prosemirror-model';
import type { Node_Type, Decoration_Type } from 'ricos-schema';

export type ContentDiffType = Node_Type | Decoration_Type | 'text';

export type ContentDiff = {
  change: 'insert' | 'delete' | 'replace';
  type: ContentDiffType;
  data?: Record<string, unknown>;
};

/**
 * Represents a content change as replacement of slices.
 *
 * @export
 * @class ContentChange
 */
export class ContentChange {
  private oldSlice: SliceTraits;

  private newSlice: SliceTraits;

  constructor(oldSlice: Slice, newSlice: Slice) {
    this.oldSlice = new SliceTraits(oldSlice);
    this.newSlice = new SliceTraits(newSlice);
  }

  private isInsertion(): boolean {
    return this.oldSlice.isEmpty() && !this.newSlice.isEmpty();
  }

  private isDeletion(): boolean {
    return !this.oldSlice.isEmpty() && this.newSlice.isEmpty();
  }

  private isReplacement(): boolean {
    return !this.isInsertion() && !this.isDeletion();
  }

  private isTextChange(): boolean {
    return (
      (this.isDeletion() && this.oldSlice.hasTextOnly()) ||
      (this.isInsertion() && this.newSlice.hasTextOnly()) ||
      (this.isReplacement() && this.oldSlice.hasTextOnly() && this.newSlice.hasTextOnly())
    );
  }

  private isMarkChange(): boolean {
    return this.isReplacement() && (this.oldSlice.hasMarks() || this.newSlice.hasMarks());
  }

  private getMarkDiffs(): ContentDiff[] {
    const oldMarks = this.oldSlice.getMarks();
    const newMarks = this.newSlice.getMarks();
    const diffs: ContentDiff[] = [];
    oldMarks.forEach(mark => {
      if (!newMarks.has(mark)) {
        diffs.push({ change: 'delete', type: mark.type.name as ContentDiffType });
      }
    });
    newMarks.forEach((mark: Mark) => {
      if (!oldMarks.has(mark)) {
        diffs.push({ change: 'insert', type: mark.type.name as ContentDiffType, data: mark.attrs });
      }
    });
    return diffs;
  }

  private getNodeDiffs(): ContentDiff[] {
    const oldNodes = this.oldSlice.getNodes();
    const newNodes = this.newSlice.getNodes();
    const diffs: ContentDiff[] = [];
    oldNodes.forEach((node: Node) => {
      if (!newNodes.has(node)) {
        diffs.push({ change: 'delete', type: node.type.name as ContentDiffType, data: node.attrs });
      }
    });
    newNodes.forEach((node: Node) => {
      if (!oldNodes.has(node)) {
        diffs.push({ change: 'insert', type: node.type.name as ContentDiffType, data: node.attrs });
      }
    });
    return diffs;
  }

  getDiff(): ContentDiff[] {
    if (this.isTextChange()) {
      return [
        {
          change: this.isReplacement() ? 'replace' : this.isInsertion() ? 'insert' : 'delete',
          type: 'text',
        },
      ];
    }
    if (this.isMarkChange()) {
      return this.getMarkDiffs();
    }

    // TODO: implement node attribute change as well

    return this.getNodeDiffs();
  }

  toJSON() {
    return {
      old: this.oldSlice.toJSON(),
      new: this.newSlice.toJSON(),
    };
  }
}

/**
 * Wraps prosemirror/model Slice to provide additional traits
 *
 * @class SliceTraits
 */
class SliceTraits {
  constructor(public slice: Slice) {
    this.slice = slice;
  }

  isEmpty(): boolean {
    return !this.slice || this.slice.size === 0;
  }

  getMarks(): Set<Mark> {
    return new Set(this.slice?.content.firstChild?.marks || []);
  }

  getNodes(): Set<Node> {
    const nodes: Node[] = [];
    this.slice?.content.descendants((node: Node) => {
      if (!node.isText) {
        nodes.push(node);
      }
      // TODO: should return false for nested nodes?
      return true;
    });
    return new Set(nodes);
  }

  toJSON() {
    return this.slice?.toJSON() || {};
  }

  hasTextOnly(): boolean {
    return (
      !!this.slice &&
      this.slice.content.childCount === 1 &&
      !!this.slice.content.firstChild?.isText &&
      this.slice.content.firstChild?.marks.length === 0
    );
  }

  hasMarks(): boolean {
    return (
      !!this.slice &&
      this.slice.content.childCount === 1 &&
      !!this.slice.content.firstChild?.isText &&
      this.slice.content.firstChild?.marks.length > 0
    );
  }
}
