import type { ButtonNode } from 'ricos-content';
import {
  ButtonData_Type,
  Link_Target,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { actionButtonConverter, linkButtonConverter } from './button-converters';

describe('linkButton converter', () => {
  const tiptapNode = {
    type: 'LINK_BUTTON',
    attrs: {
      type: ButtonData_Type.LINK,
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
          custom: '212',
        },
        textWrap: true,
      },
      styles: {
        border: {
          width: 7,
          radius: 5,
        },
        colors: {
          text: '#0261FF',
          border: '#0261FF',
          background: '#FEFDFD',
        },
      },
      text: 'Link Button',
      link: {
        target: Link_Target.BLANK,
        anchor: '123',
        url: 'www.wix.com',
        rel: {
          nofollow: true,
        },
      },
      id: '14',
    },
  };

  const linkButtonNode: ButtonNode = {
    type: Node_Type.BUTTON,
    id: '14',
    nodes: [],
    buttonData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
          custom: '212',
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      type: ButtonData_Type.LINK,
      styles: {
        border: {
          width: 7,
          radius: 5,
        },
        colors: {
          text: '#0261FF',
          border: '#0261FF',
          background: '#FEFDFD',
        },
      },
      text: 'Link Button',
      link: {
        url: 'www.wix.com',
        anchor: '123',
        target: Link_Target.BLANK,
        rel: {
          nofollow: true,
        },
      },
    },
  };

  it('should convert LinkButtonNode to TiptapNode', () => {
    const actual = linkButtonConverter.toTiptap.convert(linkButtonNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to LinkButtonNode', () => {
    const actual = linkButtonConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(linkButtonNode);
  });
});

describe('actionButton converter', () => {
  const tiptapNode = {
    type: 'ACTION_BUTTON',
    attrs: {
      type: ButtonData_Type.ACTION,
      containerData: {
        alignment: PluginContainerData_Alignment.LEFT,
        width: {
          size: PluginContainerData_Width_Type.ORIGINAL,
        },
        textWrap: true,
      },
      styles: {
        border: {
          width: 0,
          radius: 15,
        },
        colors: {
          text: '#FEFDFD',
          border: '#0261FF',
          background: '#81B0FF',
        },
      },
      text: 'Action Button',
      id: '16',
    },
  };

  const actionButtonNode: ButtonNode = {
    type: Node_Type.BUTTON,
    id: '16',
    nodes: [],
    buttonData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.ORIGINAL,
        },
        alignment: PluginContainerData_Alignment.LEFT,
        textWrap: true,
      },
      type: ButtonData_Type.ACTION,
      styles: {
        border: {
          width: 0,
          radius: 15,
        },
        colors: {
          text: '#FEFDFD',
          border: '#0261FF',
          background: '#81B0FF',
        },
      },
      text: 'Action Button',
    },
  };

  it('should convert ActionButtonNode to TiptapNode', () => {
    const actual = actionButtonConverter.toTiptap.convert(actionButtonNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to ActionButtonNode', () => {
    const actual = actionButtonConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(actionButtonNode);
  });
});
