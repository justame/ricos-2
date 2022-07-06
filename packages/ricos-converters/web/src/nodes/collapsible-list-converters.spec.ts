import type { CollapsibleListNode } from 'ricos-content';
import {
  CollapsibleListData_Direction,
  CollapsibleListData_InitialExpandedItems,
  Decoration_Type,
  PluginContainerData_Alignment,
  TextStyle_TextAlignment,
  Node_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { collapsibleListConverter } from './collapsible-list-converters';

describe('collapsibeListNode converter', () => {
  const tiptapNode = {
    type: Node_Type.COLLAPSIBLE_LIST,
    attrs: {
      initialExpandedItems: CollapsibleListData_InitialExpandedItems.FIRST,
      direction: CollapsibleListData_Direction.LTR,
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      expandOnlyOne: false,
      id: '95',
    },
    content: [
      {
        type: Node_Type.COLLAPSIBLE_ITEM,
        attrs: {
          id: '96',
        },
        content: [
          {
            type: Node_Type.COLLAPSIBLE_ITEM_TITLE,
            attrs: {
              id: '97',
            },
            content: [
              {
                type: Node_Type.PARAGRAPH,
                attrs: {
                  textStyle: {
                    textAlignment: TextStyle_TextAlignment.AUTO,
                  },
                  indentation: 0,
                  id: '98',
                },
                content: [
                  {
                    type: 'text',
                    text: 'Collapsible List',
                    marks: [
                      {
                        type: Decoration_Type.COLOR,
                        attrs: {
                          foreground: 'color4',
                        },
                      },
                    ],
                    attrs: {
                      id: '',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: Node_Type.COLLAPSIBLE_ITEM_BODY,
            attrs: {
              id: '100',
            },
            content: [
              {
                type: Node_Type.PARAGRAPH,
                attrs: {
                  textStyle: {
                    textAlignment: TextStyle_TextAlignment.AUTO,
                  },
                  indentation: 0,
                  id: '101',
                },
                content: [],
              },
            ],
          },
        ],
      },
      {
        type: Node_Type.COLLAPSIBLE_ITEM,
        attrs: {
          id: '102',
        },
        content: [
          {
            type: Node_Type.COLLAPSIBLE_ITEM_TITLE,
            attrs: {
              id: '103',
            },
            content: [
              {
                type: Node_Type.BLOCKQUOTE,
                attrs: {
                  paragraphId: '105',
                  textStyle: {
                    textAlignment: TextStyle_TextAlignment.AUTO,
                  },
                  indentation: 0,
                  id: '104',
                },
                content: [
                  {
                    type: 'text',
                    text: '#LivingTheDream',
                    marks: [],
                    attrs: {
                      id: '',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: Node_Type.COLLAPSIBLE_ITEM_BODY,
            attrs: {
              id: '106',
            },
            content: [
              {
                type: Node_Type.PARAGRAPH,
                attrs: {
                  textStyle: {
                    textAlignment: TextStyle_TextAlignment.AUTO,
                  },
                  indentation: 0,
                  id: '107',
                },
                content: [
                  {
                    type: 'text',
                    text: 'Yo yo yo!',
                    marks: [
                      {
                        type: Decoration_Type.BOLD,
                        attrs: {
                          fontWeightValue: 700,
                        },
                      },
                    ],
                    attrs: {
                      id: '',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const collapsibleListNode: CollapsibleListNode = {
    type: Node_Type.COLLAPSIBLE_LIST,
    id: '95',
    nodes: [
      {
        type: Node_Type.COLLAPSIBLE_ITEM,
        id: '96',
        nodes: [
          {
            type: Node_Type.COLLAPSIBLE_ITEM_TITLE,
            id: '97',
            nodes: [
              {
                type: Node_Type.PARAGRAPH,
                id: '98',
                nodes: [
                  {
                    type: Node_Type.TEXT,
                    id: '',
                    nodes: [],
                    textData: {
                      text: 'Collapsible List',
                      decorations: [
                        {
                          type: Decoration_Type.COLOR,
                          colorData: {
                            foreground: 'color4',
                          },
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
            ],
          },
          {
            type: Node_Type.COLLAPSIBLE_ITEM_BODY,
            id: '100',
            nodes: [
              {
                type: Node_Type.PARAGRAPH,
                id: '101',
                nodes: [],
                paragraphData: {
                  textStyle: {
                    textAlignment: TextStyle_TextAlignment.AUTO,
                  },
                  indentation: 0,
                },
              },
            ],
          },
        ],
      },
      {
        type: Node_Type.COLLAPSIBLE_ITEM,
        id: '102',
        nodes: [
          {
            type: Node_Type.COLLAPSIBLE_ITEM_TITLE,
            id: '103',
            nodes: [
              {
                type: Node_Type.BLOCKQUOTE,
                id: '104',
                nodes: [
                  {
                    type: Node_Type.PARAGRAPH,
                    id: '105',
                    nodes: [
                      {
                        type: Node_Type.TEXT,
                        id: '',
                        nodes: [],
                        textData: {
                          text: '#LivingTheDream',
                          decorations: [],
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
                ],
                blockquoteData: {
                  indentation: 0,
                },
              },
            ],
          },
          {
            type: Node_Type.COLLAPSIBLE_ITEM_BODY,
            id: '106',
            nodes: [
              {
                type: Node_Type.PARAGRAPH,
                id: '107',
                nodes: [
                  {
                    type: Node_Type.TEXT,
                    id: '',
                    nodes: [],
                    textData: {
                      text: 'Yo yo yo!',
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
            ],
          },
        ],
      },
    ],
    collapsibleListData: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      expandOnlyOne: false,
      initialExpandedItems: CollapsibleListData_InitialExpandedItems.FIRST,
      direction: CollapsibleListData_Direction.LTR,
    },
  };

  it('should convert CollapsibleListNode to TiptapNode', () => {
    const actual = collapsibleListConverter.toTiptap.convert(collapsibleListNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to CollapsibleListNode', () => {
    const actual = collapsibleListConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(collapsibleListNode);
  });
});
