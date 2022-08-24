import type { Node } from 'ricos-schema';
import type { Transform, Transforms } from './models/converter';
import { getUnsupportedFromTiptap, getUnsupportedToTiptap } from './node-converters';
import type { TiptapNodeConverter, TiptapNode } from './types';

class ToTiptapNodeTransforms implements Transforms<Node, TiptapNode> {
  private readonly transforms: Transform<Node, TiptapNode>[];

  constructor(transforms: Transform<Node, TiptapNode>[]) {
    this.transforms = transforms;
  }

  byType(node: Node): Transform<Node, TiptapNode> {
    return this.transforms.find(tr => tr.types.includes(node.type)) || getUnsupportedToTiptap(node);
  }
}

class FromTiptapNodeTransforms implements Transforms<TiptapNode, Node> {
  private readonly transforms: Transform<TiptapNode, Node>[];

  constructor(transforms: Transform<TiptapNode, Node>[]) {
    this.transforms = transforms;
  }

  byType(node: Node): Transform<TiptapNode, Node> {
    return (
      this.transforms.find(tr => tr.types.includes(node.type)) || getUnsupportedFromTiptap(node)
    );
  }
}

export class TiptapNodeBidiTransfoms {
  converters: TiptapNodeConverter[];

  constructor(converters: TiptapNodeConverter[]) {
    this.converters = converters;
  }

  toTiptap() {
    return new ToTiptapNodeTransforms(this.converters.map(({ toTiptap }) => toTiptap));
  }

  fromTiptap() {
    return new FromTiptapNodeTransforms(this.converters.map(({ fromTiptap }) => fromTiptap));
  }
}
