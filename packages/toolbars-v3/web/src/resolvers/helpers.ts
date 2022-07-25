import type { Node, Decoration } from 'ricos-schema';
import { Node_Type, Decoration_Type } from 'ricos-schema';
import { isFunction } from 'lodash';

const convertDecorationsToCSS = (decorations?: Decoration[]) => {
  let draftBlockStyles = {};
  decorations?.forEach(decoration => {
    const ricosDecortationFn = ricosDecorationToCss[decoration.type];
    let ricosDecoration = {};
    if (isFunction(ricosDecortationFn)) {
      ricosDecoration = ricosDecortationFn(decoration);
    }
    decoration &&
      (draftBlockStyles = {
        ...draftBlockStyles,
        ...ricosDecoration,
      });
  });
  return draftBlockStyles;
};

const ricosDecorationToCss = {
  [Decoration_Type.BOLD]: ({ fontWeightValue }) => {
    return fontWeightValue ? { 'font-weight': fontWeightValue >= 700 ? 'bold' : 'normal' } : {};
  },
  [Decoration_Type.ITALIC]: ({ italicData }) => {
    return typeof italicData !== 'undefined'
      ? { 'font-style': italicData ? 'italic' : 'normal' }
      : {};
  },
  [Decoration_Type.UNDERLINE]: ({ underlineData }) => {
    return typeof underlineData !== 'undefined'
      ? {
          'text-decoration': underlineData ? 'underline' : 'none',
        }
      : {};
  },
  [Decoration_Type.FONT_SIZE]: ({ fontSizeData }) => {
    return fontSizeData
      ? { 'font-size': fontSizeData.value + (fontSizeData.unit.toLowerCase() || 'px') }
      : {};
  },
  [Decoration_Type.COLOR]: ({ colorData }) => {
    const { foreground, background } = colorData;
    const colors = {};
    // eslint-disable-next-line dot-notation
    foreground && (colors['color'] = foreground);
    background && (colors['background-color'] = background);
    return colors;
  },
};

const convertNodeStyleToCss = nodeStyle => {
  const css = {};
  nodeStyle.paddingTop && (css['padding-top'] = nodeStyle.paddingTop);
  nodeStyle.paddingBottom && (css['padding-bottom'] = nodeStyle.paddingBottom);
  nodeStyle.lineHeight && (css['line-height'] = nodeStyle.lineHeight);
  return css;
};

export const convertInlineStylesToCSS = (node: Node) => {
  if ([Node_Type.PARAGRAPH, Node_Type.HEADING].includes(node.type)) {
    const nodeStyle = node.style;
    const { lineHeight } = node.paragraphData?.textStyle || node.headingData?.textStyle || {};
    const styles = node.nodes.reduce((prevStyles, currentNode) => {
      return {
        ...prevStyles,
        ...convertDecorationsToCSS(currentNode.textData?.decorations),
      };
    }, {});
    return { ...styles, ...convertNodeStyleToCss({ ...nodeStyle, lineHeight }) };
  }
  return {};
};

export const getInlineStylesInSelection = (content, nodeService) => {
  let node;
  // eslint-disable-next-line fp/no-loops
  for (const currNode of content) {
    if (
      [Node_Type.PARAGRAPH as string, Node_Type.HEADING as string].includes(currNode?.type?.name)
    ) {
      node = nodeService.fromTiptapNode({ ...currNode.toJSON(), type: currNode?.type?.name });
      break;
    }
  }

  return node ? convertInlineStylesToCSS(node) : {};
};
