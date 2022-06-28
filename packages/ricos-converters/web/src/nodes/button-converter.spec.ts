import type { ButtonNode } from 'ricos-content';
import {
  ButtonData_Type,
  Link_Target,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { linkButtonConverter } from './button-converters';

describe('linkButton converter', () => {
  const tiptapNode = {
    type: 'LINK_BUTTON',
    attrs: {
      type: 'LINK',
      containerData: {
        alignment: 'CENTER',
        width: {
          size: 'CONTENT',
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
        target: 'BLANK',
        anchor: '123',
        url: 'www.wix.com',
        rel: {
          nofollow: true,
        },
      },
      id: '14',
    },
  };

  const buttonNode: ButtonNode = {
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

  it('should convert ButtonNode to TiptapNode', () => {
    const actual = linkButtonConverter.toTiptap.convert(buttonNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to ButtonNode', () => {
    const actual = linkButtonConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(buttonNode);
  });
});
