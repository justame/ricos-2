import type { NodeStyle as NodeStyleRichContent } from 'ricos-schema';
import type { CustomTextualStyle } from 'ricos-types';
import type { NodeStyle } from '../models/node-style';

export class RicosNodeStyle implements NodeStyle {
  nodeStyle: NodeStyleRichContent;

  private constructor(nodeStyle: NodeStyleRichContent) {
    this.nodeStyle = nodeStyle;
  }

  static of(nodeStyle?: NodeStyleRichContent): RicosNodeStyle {
    return new RicosNodeStyle(nodeStyle || {});
  }

  getNodeStyle: NodeStyle['getNodeStyle'] = () => this.nodeStyle;

  static fromCustomStyle = (customStyle: CustomTextualStyle): NodeStyle => {
    const { paddingBottom, paddingTop } = customStyle;
    const nodeStyle = {
      paddingBottom,
      paddingTop,
    };
    return RicosNodeStyle.of(nodeStyle as NodeStyleRichContent);
  };

  toCustomStyle: NodeStyle['toCustomStyle'] = () => {
    return { paddingBottom: this.nodeStyle.paddingBottom, paddingTop: this.nodeStyle.paddingTop };
  };

  overrideWith: NodeStyle['overrideWith'] = (NodeStyle = {}) => {
    return RicosNodeStyle.of({ ...this.nodeStyle, ...NodeStyle });
  };
}
