import type { RicosTheme } from 'ricos-types';
import type { DocumentStyle } from 'ricos-schema';
import { Node_Type } from 'ricos-schema';
import { Decoration_Type } from 'ricos-types';
import { decorations, customStyle } from './tests/test-cases';
import { RicosStyles } from './styles';
import type { HeadingNode, ParagraphNode } from 'ricos-content';

describe('Styles', () => {
  it('Should getDecoration match document style decoration ', () => {
    const documentStyle = {
      headerOne: {
        decorations,
      },
    };
    const theme: RicosTheme = {
      customStyles: {
        h1: { ...customStyle, color: '#888888' },
      },
    };
    const styles = new RicosStyles().setTheme(theme).setDocumentStyle(documentStyle);
    const headingNode = {
      type: Node_Type.HEADING,
      headingData: { level: 1 },
      id: '',
      nodes: [],
    } as HeadingNode;
    const decoration = styles.getDecoration(headingNode, Decoration_Type.COLOR);
    expect(decoration).toEqual({
      colorData: {
        foreground: '#414141',
        background: '#808080',
      },
      type: 'COLOR',
    });
  });

  it('Should getDecoration match theme decoration', () => {
    const documentStyle = {
      headerOne: {
        decorations,
      },
    };
    const theme: RicosTheme = {
      customStyles: {
        p: { ...customStyle, color: '#888888' },
      },
    };
    const styles = new RicosStyles().setTheme(theme).setDocumentStyle(documentStyle);
    const paragraphNode = {
      type: Node_Type.PARAGRAPH,
      id: '',
      nodes: [],
      paragraphData: {},
    } as ParagraphNode;
    const decoration = styles.getDecoration(paragraphNode, Decoration_Type.COLOR);
    expect(decoration).toEqual({
      colorData: {
        foreground: '#888888',
      },
      type: 'COLOR',
    });
  });

  it('Should initialize styles with empty documentStyle & theme', () => {
    const documentStyle = {};
    const theme: RicosTheme = {};
    const styles = new RicosStyles().setTheme(theme).setDocumentStyle(documentStyle);
    const headingNode = {
      type: Node_Type.HEADING,
      headingData: { level: 1 },
      id: '',
      nodes: [],
    } as HeadingNode;
    const decoration = styles.getDecoration(headingNode, Decoration_Type.COLOR);
    expect(decoration).toEqual({});
  });

  it('Should initialize styles without decorations in documentStyle', () => {
    const documentStyle = {
      headerOne: {},
    };
    const theme: RicosTheme = {
      customStyles: {
        p: {},
      },
    };
    const styles = new RicosStyles()
      .setTheme(theme)
      .setDocumentStyle(documentStyle as DocumentStyle);
    const headingNode = {
      type: Node_Type.HEADING,
      headingData: { level: 1 },
      id: '',
      nodes: [],
    } as HeadingNode;
    const decoration = styles.getDecoration(headingNode, Decoration_Type.COLOR);
    expect(decoration).toEqual({});
  });
});
