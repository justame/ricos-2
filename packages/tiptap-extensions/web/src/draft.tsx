import React from 'react';
import type { Node_Type } from 'ricos-schema';
import type { RicosExtension } from 'ricos-types';
import toConstantCase from 'to-constant-case';
import { tiptapNodeDataToDraft } from 'ricos-converters';

const DraftHOC = Component => {
  const Draft = props => {
    const { componentData, node } = props;
    const ricosNodeType = toConstantCase(node.type.name) as Node_Type;
    const data = tiptapNodeDataToDraft(ricosNodeType, componentData);
    const newProps = {
      ...props,
      componentData: data,
    };
    return Component ? <Component {...newProps} /> : null;
  };

  Draft.displayName = 'ToDraftHoc';
  return Draft;
};

export const draft: RicosExtension = {
  type: 'extension' as const,
  groups: [],
  name: 'draft',
  createExtensionConfig() {
    return {
      name: this.name,
      priority: 1,
      addNodeHoc() {
        return {
          priority: 9,
          nodeTypes: ['*'],
          nodeHoc: DraftHOC,
        };
      },
    };
  },
};
