import { convertDocumentStyleDecorationTypes } from '../decorationParsers';
import type { TextNodeStyle } from 'ricos-schema';

const convertNodeStyleToCss = nodeStyle => {
  const css = {};
  nodeStyle.paddingTop && (css['padding-top'] = nodeStyle.paddingTop);
  nodeStyle.paddingBottom && (css['padding-bottom'] = nodeStyle.paddingBottom);
  nodeStyle.lineHeight && (css['line-height'] = nodeStyle.lineHeight);
  return css;
};

const parseDocStyle = documentStyle => {
  const draftDocStyle = {};
  Object.entries(documentStyle).forEach(([header, values]) => {
    if (values) {
      const { decorations = [], nodeStyle, lineHeight } = values as TextNodeStyle;
      draftDocStyle[header as string] = {
        ...convertDocumentStyleDecorationTypes(decorations),
        ...convertNodeStyleToCss({ ...nodeStyle, lineHeight }),
      };
    }
  });
  return draftDocStyle;
};

export default parseDocStyle;
