import DocumentStyle from './document-style';
import { decorations, nodeStyle, textStyle, headingNode } from '../tests/test-cases';
import type { HeadingNode } from 'ricos-content';
import { Decoration_Type } from 'ricos-schema';

describe('Document Style', () => {
  const documentStyle = {
    headerOne: {
      decorations,
      nodeStyle,
      ...textStyle,
    },
    paragraph: {
      decorations,
    },
  };

  it('Should toStyleTag match expected', () => {
    const styleTag = new DocumentStyle(documentStyle).toStyleTag();
    expect(styleTag.type).toStrictEqual('style');
    expect(
      JSON.stringify(styleTag.props.children).includes('--ricos-custom-h1-color: #414141')
    ).toBeTruthy();
    expect(
      JSON.stringify(styleTag.props.children).includes('--ricos-custom-h1-font-weight: 700')
    ).toBeTruthy();
    expect(
      JSON.stringify(styleTag.props.children).includes('--ricos-custom-p-color: #414141')
    ).toBeTruthy();
    expect(
      JSON.stringify(styleTag.props.children).includes('--ricos-custom-h1-line-height: 3')
    ).toBeTruthy();
    expect(
      JSON.stringify(styleTag.props.children).includes('--ricos-custom-h1-padding-bottom: 3px')
    ).toBeTruthy();
    expect(
      JSON.stringify(styleTag.props.children).includes('--ricos-custom-h1-padding-top: 2px')
    ).toBeTruthy();
    expect(
      JSON.stringify(styleTag.props.children).includes('--ricos-custom-p-background-color: #808080')
    ).toBeTruthy();
  });

  it('Should fromNode match expected', () => {
    const documentStyleContent = DocumentStyle.fromNode(headingNode as HeadingNode).toContent();
    const expected = {
      headerThree: {
        decorations: [
          {
            type: 'COLOR',
            colorData: {
              foreground: '#818181',
            },
          },
          {
            type: 'BOLD',
            fontWeightValue: 700,
          },
        ],
        nodeStyle: {
          paddingTop: '5px',
          paddingBottom: '2px',
        },
        lineHeight: '3',
      },
    };
    expect(documentStyleContent).toStrictEqual(expected);
  });

  it('Should setStyle match expected', () => {
    const documentStyleContent = new DocumentStyle(documentStyle)
      .setStyle('headerOne', {
        decorations,
        lineHeight: '5',
      })
      .toContent();
    const expected = {
      headerOne: {
        decorations,
        nodeStyle,
        lineHeight: '5',
      },
      paragraph: {
        decorations,
      },
    };
    expect(documentStyleContent).toStrictEqual(expected);
  });

  it('Should mergeWith match expected', () => {
    const documentStyleContent = new DocumentStyle(documentStyle)
      .mergeWith({
        headerOne: {
          decorations,
          lineHeight: '5',
        },
      })
      .toContent();

    const expected = {
      headerOne: {
        decorations,
        nodeStyle,
        lineHeight: '5',
      },
      paragraph: {
        decorations,
      },
    };
    expect(documentStyleContent).toStrictEqual(expected);
  });

  it('Should mergeWith match expected 2', () => {
    const documentStyleContent = new DocumentStyle({
      headerOne: {
        decorations: [
          {
            type: Decoration_Type.COLOR,
            colorData: {
              background: '#bf695c',
            },
          },
        ],
      },
      paragraph: {
        decorations: [],
      },
    })
      .mergeWith({
        headerOne: {
          decorations: [
            {
              type: Decoration_Type.ITALIC,
              italicData: true,
            },
          ],
        },
        paragraph: {
          decorations,
        },
      })
      .toContent();

    const expected = {
      headerOne: {
        nodeStyle: {},
        decorations: [
          {
            type: Decoration_Type.COLOR,
            colorData: {
              background: '#bf695c',
            },
          },
          {
            type: Decoration_Type.ITALIC,
            italicData: true,
          },
        ],
      },
      paragraph: {
        decorations,
        nodeStyle: {},
      },
    };
    expect(documentStyleContent).toStrictEqual(expected);
  });
});
