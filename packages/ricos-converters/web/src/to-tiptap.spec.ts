import type { RichContent } from 'ricos-schema';
import {
  Decoration_Type,
  DividerData_Alignment,
  DividerData_LineStyle,
  DividerData_Width,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
  TextStyle_TextAlignment,
} from 'ricos-schema';

import { toTiptap } from './index';

describe('to Tiptap', () => {
  it('should convert paragraph & divider', () => {
    const content: RichContent = {
      nodes: [
        {
          type: Node_Type.PARAGRAPH,
          id: 'leohf3',
          nodes: [
            {
              type: Node_Type.TEXT,
              id: '',
              nodes: [],
              textData: {
                text: 'test',
                decorations: [
                  {
                    type: Decoration_Type.BOLD,
                    fontWeightValue: 700,
                  },
                ],
              },
            },
          ],
          paragraphData: {
            textStyle: {
              textAlignment: TextStyle_TextAlignment.AUTO,
            },
            indentation: 0,
          },
        },
        {
          type: Node_Type.PARAGRAPH,
          id: '6du4s354',
          nodes: [],
          paragraphData: {
            textStyle: {
              textAlignment: TextStyle_TextAlignment.AUTO,
            },
            indentation: 0,
          },
        },
        {
          type: Node_Type.DIVIDER,
          id: 'n2d72352',
          nodes: [],
          dividerData: {
            lineStyle: DividerData_LineStyle.SINGLE,
            width: DividerData_Width.LARGE,
            alignment: DividerData_Alignment.CENTER,
            containerData: {
              alignment: PluginContainerData_Alignment.CENTER,
              width: {
                size: PluginContainerData_Width_Type.CONTENT,
              },
              textWrap: true,
            },
          },
        },
        {
          type: Node_Type.PARAGRAPH,
          id: 'd6064355',
          nodes: [],
          paragraphData: {
            textStyle: {
              textAlignment: TextStyle_TextAlignment.AUTO,
            },
            indentation: 0,
          },
        },
      ],
      metadata: {
        version: 1,
        createdTimestamp: new Date('2022-05-28T20:09:10.749Z'),
        updatedTimestamp: new Date('2022-05-28T20:09:10.749Z'),
        id: '1dda5bc8-0920-4ccd-b4b3-331bcda058f9',
      },
      documentStyle: {},
    };
    const expected = {
      type: 'doc',
      content: [
        {
          type: Node_Type.PARAGRAPH,
          content: [
            {
              type: Node_Type.TEXT,
              text: 'test',
              marks: [
                {
                  type: Decoration_Type.BOLD,
                  attrs: { fontWeightValue: 700 },
                },
              ],
              attrs: {
                id: '',
              },
            },
          ],
          attrs: {
            textStyle: {
              textAlignment: 'AUTO',
            },
            indentation: 0,
            id: 'leohf3',
          },
        },
        {
          type: Node_Type.PARAGRAPH,
          content: [],
          attrs: {
            textStyle: {
              textAlignment: 'AUTO',
            },
            indentation: 0,
            id: '6du4s354',
          },
        },
        {
          type: Node_Type.DIVIDER,
          attrs: {
            containerData: {
              width: {
                size: 'CONTENT',
              },
              alignment: 'CENTER',
              textWrap: true,
            },
            lineStyle: 'SINGLE',
            width: 'LARGE',
            alignment: 'CENTER',
            id: 'n2d72352',
          },
        },
        {
          type: Node_Type.PARAGRAPH,
          content: [],
          attrs: {
            textStyle: {
              textAlignment: 'AUTO',
            },
            indentation: 0,
            id: 'd6064355',
          },
        },
      ],
      attrs: {
        metadata: {
          id: '1dda5bc8-0920-4ccd-b4b3-331bcda058f9',
          version: 1,
          createdTimestamp: '2022-05-28T20:09:10.749Z',
          updatedTimestamp: '2022-05-28T20:09:10.749Z',
        },
        documentStyle: {},
      },
    };
    const actual = toTiptap(content);
    expect(actual).toStrictEqual(expected);
  });
});
