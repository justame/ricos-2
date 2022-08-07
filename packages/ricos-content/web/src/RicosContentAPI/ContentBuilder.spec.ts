import { setupContentBuilder } from './RicosContentBuilder';
import type { ImageData, ParagraphData, AppEmbedData } from 'ricos-schema';
import {
  PluginContainerData_Width_Type,
  PluginContainerData_Alignment,
  RichContent,
  Node_Type,
  TextStyle_TextAlignment,
  Decoration_Type,
  AppEmbedData_AppType,
} from 'ricos-schema';
import type { TableCell } from '../types/contentApi';
import type { RichText } from '../types/node-refined-types';

describe('Ricos Content Builder', () => {
  it('should implement ContentBuilder', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    expect(api.addAppEmbed).toBeDefined();
    expect(api.addBulletList).toBeDefined();
    expect(api.addButton).toBeDefined(); // TODO: API should accept url
    expect(api.addCode).toBeDefined();
    expect(api.addCollapsibleList).toBeDefined();
    expect(api.addDivider).toBeDefined();
    expect(api.addEmbed).toBeDefined();
    expect(api.addFile).toBeDefined(); // TODO: API should accept url
    expect(api.addGallery).toBeDefined(); // TODO: API should accept urls
    expect(api.addGif).toBeDefined(); // TODO: API should accept url
    expect(api.addHeading).toBeDefined();
    expect(api.addHtml).toBeDefined(); // TODO: API should accept url
    expect(api.addImage).toBeDefined(); // TODO: API should accept url
    expect(api.addLinkPreview).toBeDefined(); // TODO: API should accept url
    expect(api.addMap).toBeDefined(); // TODO: API should accept address
    expect(api.addOrderedList).toBeDefined();
    expect(api.addParagraph).toBeDefined();
    expect(api.addPoll).toBeDefined();
    expect(api.addTable).toBeDefined();
    expect(api.addVideo).toBeDefined(); // TODO: API should accept url
  });

  it('should add image node to content', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const imageData: ImageData = {
      containerData: {
        width: { size: PluginContainerData_Width_Type.SMALL },
        alignment: PluginContainerData_Alignment.CENTER,
      },
    };
    const expected: RichContent = {
      nodes: [
        {
          type: Node_Type.IMAGE,
          imageData,
          nodes: [],
          id: 'foo',
        },
      ],
    };
    const actual = api.addImage({ data: imageData, content: { nodes: [] } });
    expect(actual).toEqual(expected);
  });

  it('should add a paragraph with mention and text to content', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const expected: RichContent = RichContent.fromJSON({
      nodes: [
        {
          id: 'foo',
          type: 'PARAGRAPH',
          paragraphData: {
            indentation: 0,
            textStyle: {
              textAlignment: 'AUTO',
            },
          },
          nodes: [
            {
              nodes: [],
              id: '',
              type: 'TEXT',
              textData: {
                text: '@rudnitskih+2',
                decorations: [
                  {
                    type: 'MENTION',
                    mentionData: {
                      name: 'rudnitskih+1',
                      slug: '4cdf4cfb-a812-4b87-8815-2bebcfa15f38',
                      id: '1234',
                    },
                  },
                ],
              },
            },
            {
              nodes: [],
              id: '',
              type: 'TEXT',
              textData: {
                text: 'Hello',
              },
            },
          ],
        },
      ],
    });
    const actual = api.addParagraph({
      text: [
        {
          text: '@rudnitskih+2',
          decorations: [
            {
              type: Decoration_Type.MENTION,
              mentionData: {
                name: 'rudnitskih+1',
                slug: '4cdf4cfb-a812-4b87-8815-2bebcfa15f38',
                id: '1234',
              },
            },
          ],
        },
        'Hello',
      ],
      content: { nodes: [] },
    });

    expect(actual).toEqual(expected);
  });

  it('should add bullet list with string items to content', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const paragraphData: ParagraphData = {
      textStyle: {
        textAlignment: TextStyle_TextAlignment.RIGHT,
      },
    };
    const expected: RichContent = {
      nodes: [
        {
          type: Node_Type.BULLETED_LIST,
          id: 'foo',
          nodes: [
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData,
                  nodes: [
                    {
                      id: '',
                      type: Node_Type.TEXT,
                      textData: {
                        text: 'item1',
                        decorations: [],
                      },
                      nodes: [],
                    },
                  ],
                },
              ],
            },
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData,
                  nodes: [
                    {
                      id: '',
                      type: Node_Type.TEXT,
                      textData: {
                        text: 'item2',
                        decorations: [],
                      },
                      nodes: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const actual = api.addBulletList({
      items: ['item1', 'item2'],
      data: paragraphData,
      content: { nodes: [] },
    });
    expect(actual).toEqual(expected);
  });

  it('should add ordered list with mixed items to content', () => {
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const paragraphData: ParagraphData = {
      textStyle: {
        textAlignment: TextStyle_TextAlignment.RIGHT,
      },
    };
    const textDataItem1 = {
      text: 'item1',
      decorations: [{ type: Decoration_Type.BOLD }],
    };
    const listItem2 = {
      text: [{ text: 'item2', decorations: [{ type: Decoration_Type.ITALIC }] }],
      data: { textStyle: { textAlignment: TextStyle_TextAlignment.AUTO }, indentation: 2 },
    };
    const expected: RichContent = {
      nodes: [
        {
          type: Node_Type.ORDERED_LIST,
          id: 'foo',
          nodes: [
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData,
                  nodes: [
                    {
                      id: '',
                      type: Node_Type.TEXT,
                      textData: {
                        text: 'item1',
                        decorations: [{ type: Decoration_Type.BOLD }],
                      },
                      nodes: [],
                    },
                  ],
                },
              ],
            },
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData: {
                    textStyle: { textAlignment: TextStyle_TextAlignment.AUTO },
                    indentation: 2,
                  },
                  nodes: [
                    {
                      id: '',
                      type: Node_Type.TEXT,
                      textData: {
                        text: 'item2',
                        decorations: [{ type: Decoration_Type.ITALIC }],
                      },
                      nodes: [],
                    },
                  ],
                },
              ],
            },
            {
              type: Node_Type.LIST_ITEM,
              id: 'foo',
              nodes: [
                {
                  type: Node_Type.PARAGRAPH,
                  id: 'foo',
                  paragraphData,
                  nodes: [
                    {
                      id: '',
                      type: Node_Type.TEXT,
                      textData: {
                        text: 'item3',
                        decorations: [],
                      },
                      nodes: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const actual = api.addOrderedList({
      items: [textDataItem1, listItem2, 'item3'],
      data: paragraphData,
      content: { nodes: [] },
    });
    expect(actual).toEqual(expected);
  });

  it('should add AppEmbed to content', () => {
    const content = { nodes: [] };
    const appEmbedData: AppEmbedData = {
      type: AppEmbedData_AppType.EVENT,
      itemId: 'assa',
      name: 'Birthday party',
      image: {
        src: {
          url: 'https://static.wixstatic.com/media/8bb438_8307fc32bdf4455ab3033c542da4c6c7.jpg',
        },
      },
      url: 'https://static.wixstatic.com/media/8bb438_8307fc32bdf4455ab3033c542da4c6c7.jpg',
      eventData: { scheduling: 'now', location: 'home' },
    };

    const expected = { nodes: [{ type: Node_Type.APP_EMBED, id: 'foo', appEmbedData, nodes: [] }] };

    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const actual = api.addAppEmbed({ data: appEmbedData, content });
    expect(actual).toEqual(expected);
  });

  it('should add a table 3x3', () => {
    const expected = {
      nodes: [
        {
          type: 'TABLE',
          id: 'foo',
          nodes: [
            {
              type: 'TABLE_ROW',
              id: 'foo',
              nodes: [
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '1-1',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '1-2',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '1-3',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
              ],
            },
            {
              type: 'TABLE_ROW',
              id: 'foo',
              nodes: [
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '2-1',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '2-2',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '2-3',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
              ],
            },
            {
              type: 'TABLE_ROW',
              id: 'foo',
              nodes: [
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '3-1',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '3-2',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
                {
                  type: 'TABLE_CELL',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: '',
                            decorations: [],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                  tableCellData: {
                    cellStyle: {
                      verticalAlignment: 'TOP',
                    },
                    borderColors: {},
                  },
                },
              ],
            },
          ],
          tableData: {
            containerData: {
              alignment: 'CENTER',
              textWrap: true,
              width: { size: 'CONTENT' },
            },
            dimensions: {
              colsWidthRatio: [10, 10, 10],
              rowsHeight: [47, 47, 47],
              colsMinWidth: [120, 120, 120],
            },
          },
        },
      ],
    };

    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    // 3x3 cell matrix of paragraphs
    const cells: TableCell[][] = Array(3)
      .fill(0)
      .map((_, i) =>
        Array(3)
          .fill(0)
          .map((_, j) => ({
            content: api.addParagraph({
              text: `${i + 1}-${j + 1}`,
              content: { nodes: [] },
            }),
          }))
      );
    // remove last cell
    cells[2].pop();
    const actual = api.addTable({ cells, content: { nodes: [] } });
    expect(actual).toEqual(expected);
  });

  it('should add collapsible list', () => {
    const expected = {
      nodes: [
        {
          type: 'COLLAPSIBLE_LIST',
          id: 'foo',
          nodes: [
            {
              type: 'COLLAPSIBLE_ITEM',
              id: 'foo',
              nodes: [
                {
                  type: 'COLLAPSIBLE_ITEM_TITLE',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      id: 'foo',
                      nodes: [
                        {
                          type: 'TEXT',
                          id: '',
                          nodes: [],
                          textData: {
                            text: 'title',
                            decorations: [
                              {
                                type: 'BOLD',
                              },
                            ],
                          },
                        },
                      ],
                      paragraphData: {
                        textStyle: {
                          textAlignment: 'AUTO',
                        },
                        indentation: 0,
                      },
                    },
                  ],
                },
                {
                  type: 'COLLAPSIBLE_ITEM_BODY',
                  id: 'foo',
                  nodes: [
                    {
                      type: 'DIVIDER',
                      id: 'foo',
                      nodes: [],
                      dividerData: {
                        lineStyle: 'SINGLE',
                        width: 'LARGE',
                        alignment: 'CENTER',
                        containerData: {
                          alignment: 'CENTER',
                          width: {
                            size: 'CONTENT',
                          },
                          textWrap: false,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
          collapsibleListData: {
            initialExpandedItems: 'FIRST',
            direction: 'LTR',
            containerData: {
              alignment: 'CENTER',
              textWrap: true,
              width: {
                size: 'CONTENT',
              },
            },
            expandOnlyOne: false,
          },
        },
      ],
    };
    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const actual = api.addCollapsibleList({
      items: [
        {
          title: api.addParagraph({
            text: { text: 'title', decorations: [{ type: Decoration_Type.BOLD }] },
            content: { nodes: [] },
          }) as RichText,
          content: api.addDivider({ content: { nodes: [] } }),
        },
      ],
      content: { nodes: [] },
    });
    expect(actual).toEqual(expected);
  });

  it('should add Poll to content', () => {
    const content = { nodes: [] };

    const expected = {
      nodes: [
        {
          type: Node_Type.POLL,
          id: 'foo',
          pollData: {
            containerData: {
              alignment: 'CENTER',
              textWrap: true,
              width: {
                size: 'CONTENT',
              },
            },
            design: {
              options: {
                borderRadius: 0,
              },
              poll: {
                background: {
                  type: 'IMAGE',
                },
                borderRadius: 0,
              },
            },
            layout: {
              options: {
                enableImage: false,
              },
              poll: {
                direction: 'LTR',
                enableImage: false,
                type: 'LIST',
              },
            },
            poll: {
              options: [],
              settings: {
                permissions: {
                  allowMultipleVotes: false,
                  view: 'VOTERS',
                  vote: 'SITE_MEMBERS',
                },
                showVoters: true,
                showVotesCount: true,
              },
              title: '',
            },
          },
          nodes: [],
        },
      ],
    };

    const generateKey = () => 'foo';
    const api = setupContentBuilder(generateKey);
    const actual = api.addPoll({ content });
    expect(actual).toEqual(expected);
  });
});
