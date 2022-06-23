import type { LinkPreviewNode } from 'ricos-content';
import {
  Link_Target,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { linkPreviewConverter } from './link-preview-converter';

describe('LinkPreviewConverter converter', () => {
  const tiptapNode = {
    type: Node_Type.LINK_PREVIEW,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        textWrap: true,
      },
      link: {
        anchor: '420',
        target: Link_Target.BLANK,
        url: 'www.wix.com',
      },
      title: 'A mock title',
      thumbnailUrl:
        'https://image.insider.com/5de5784979d757159d0b6838?width=1100&format=jpeg&auto=webp',
      description: 'A mock description',
      id: '34',
    },
  };

  const linkPreviewNode: LinkPreviewNode = {
    type: Node_Type.LINK_PREVIEW,
    id: '34',
    nodes: [],
    linkPreviewData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      link: {
        anchor: '420',
        url: 'www.wix.com',
        target: Link_Target.BLANK,
      },
      title: 'A mock title',
      thumbnailUrl:
        'https://image.insider.com/5de5784979d757159d0b6838?width=1100&format=jpeg&auto=webp',
      description: 'A mock description',
    },
  };

  it('should convert LinkPreviewNode to TiptapNode', () => {
    const actual = linkPreviewConverter.toTiptap.convert(linkPreviewNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to LinkPreviewNode', () => {
    const actual = linkPreviewConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(linkPreviewNode);
  });
});
