export interface ConvertableNode {
  type: string;
}

export interface Tree<T extends ConvertableNode> {
  getNodes: (root: T) => T[];
  setNodes: (nodes: T[]) => Record<string, T[]>;
}

export interface Transform<SrcNode extends ConvertableNode, DestNode extends ConvertableNode> {
  types: SrcNode['type'][];
  convert: (node: SrcNode, visit?: (node: SrcNode) => DestNode[]) => DestNode;
}

export interface Transforms<SrcNode extends ConvertableNode, DestNode extends ConvertableNode> {
  byType: (node: SrcNode) => Transform<SrcNode, DestNode>;
}

export interface Converter<SrcNode extends ConvertableNode, DestNode extends ConvertableNode> {
  convert: (tree: Tree<SrcNode>, transforms: Transform<SrcNode, DestNode>[]) => Tree<DestNode>;
}
