import type { ImageNode } from 'ricos-content';
import {
  Link_Target,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { imageConverter } from './image-converter';

describe('Image converter', () => {
  const tiptapNode = {
    type: Node_Type.IMAGE,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.FULL_WIDTH,
        },
        spoiler: {
          enabled: true,
          description: 'SPOILER ALERT!!!',
          buttonText: `What's behind door number 1?`,
        },
        textWrap: true,
      },
      image: {
        src: {
          id: '8bb438_67a68c0652d740bab508f68662acc882.jpg',
        },
        width: 3192,
        height: 2124,
      },
      link: {
        anchor: '223',
        target: Link_Target.BLANK,
        url: 'www.image-link.com',
      },
      caption: 'Dad holding his baby',
      id: '2',
    },
  };

  const imageNode: ImageNode = {
    type: Node_Type.IMAGE,
    id: '2',
    nodes: [],
    imageData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.FULL_WIDTH,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        spoiler: {
          enabled: true,
          description: 'SPOILER ALERT!!!',
          buttonText: `What's behind door number 1?`,
        },
        textWrap: true,
      },
      image: {
        src: {
          id: '8bb438_67a68c0652d740bab508f68662acc882.jpg',
        },
        width: 3192,
        height: 2124,
      },
      link: {
        anchor: '223',
        url: 'www.image-link.com',
        target: Link_Target.BLANK,
      },
      caption: 'Dad holding his baby',
    },
  };

  it('should convert ImageNode to TiptapNode', () => {
    const actual = imageConverter.toTiptap.convert(imageNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to ImageNode', () => {
    const actual = imageConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(imageNode);
  });
});
