import type { Decoration, DocumentStyle as RicosDocumentStyle } from 'ricos-schema';
import { Decoration_Type } from 'ricos-schema';
import type { DocumentStyle } from '../../../types';

const cssToRicosDecoration = {
  color: (style: string) => {
    return { type: Decoration_Type.COLOR, colorData: { foreground: style } };
  },
  'background-color': (style: string) => {
    return { type: Decoration_Type.COLOR, colorData: { background: style } };
  },
  'font-weight': (style: string) => {
    return { type: Decoration_Type.BOLD, fontWeightValue: style === 'bold' ? 700 : 400 };
  },
  'font-style': (style: string) => {
    return { type: Decoration_Type.ITALIC, italicData: style === 'italic' };
  },
  'text-decoration': (style: string) => {
    return { type: Decoration_Type.UNDERLINE, underlineData: style === 'underline' };
  },
  'font-size': (style: string) => {
    const [value, unit] = style.split(/(px|em)/gi);
    return {
      type: Decoration_Type.FONT_SIZE,
      fontSizeData: { unit: unit.toUpperCase(), value: parseInt(value) },
    };
  },
};

const convertHeaderToRicosDecorations = styles =>
  Object.entries(styles)
    .filter(([key, _]) => cssToRicosDecoration[key])
    .map(([key, style]) => cssToRicosDecoration[key](style));

const convertCssToNodeStyle = styles => {
  return styles['padding-top'] || styles['padding-bottom']
    ? {
        paddingTop: styles['padding-top'],
        paddingBottom: styles['padding-bottom'],
      }
    : undefined;
};

const normalizeColorDecorations = (decorations: Decoration[]) => {
  const background = decorations.find(decoration => decoration?.colorData?.background)?.colorData
    ?.background;
  const foreground = decorations.find(decoration => decoration?.colorData?.foreground)?.colorData
    ?.foreground;

  if (background && foreground) {
    const colorDecoration = { type: Decoration_Type.COLOR, colorData: { background, foreground } };
    return decorations
      .filter(decoration => decoration.type !== Decoration_Type.COLOR)
      .concat([colorDecoration]);
  }

  return decorations;
};
export const parseDocStyle = documentStyle => {
  if (documentStyle) {
    const ricosDocumentStyle: RicosDocumentStyle = {};
    Object.entries(documentStyle).forEach(([header, styles]) => {
      if (header) {
        const decorations = normalizeColorDecorations(
          convertHeaderToRicosDecorations(styles) as Decoration[]
        );
        const nodeStyle = convertCssToNodeStyle(styles);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lineHeight = (styles as any)['line-height'];
        ricosDocumentStyle[header] = {};
        decorations?.length > 0 && (ricosDocumentStyle[header].decorations = decorations);
        nodeStyle && (ricosDocumentStyle[header].nodeStyle = nodeStyle);
        lineHeight && (ricosDocumentStyle[header].lineHeight = lineHeight);
      }
    });
    return ricosDocumentStyle;
  }
};
