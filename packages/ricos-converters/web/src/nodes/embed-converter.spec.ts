import type { EmbedNode } from 'ricos-content';
import {
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { embedConverter } from './embed-converter';

describe('embed converter', () => {
  const tiptapNode = {
    type: Node_Type.EMBED,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          custom: '350',
          size: PluginContainerData_Width_Type.CONTENT,
        },
        textWrap: true,
      },
      oembed: {
        type: 'rich',
      },
      src: 'https://twitter.com/CNN/status/1244886173409034240',
      id: '12',
    },
  };

  const embedNode: EmbedNode = {
    type: Node_Type.EMBED,
    id: '12',
    nodes: [],
    embedData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
          custom: '350',
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      oembed: {
        type: 'rich',
      },
      src: 'https://twitter.com/CNN/status/1244886173409034240',
    },
  };

  it('should convert EmbedNode to TiptapNode', () => {
    const actual = embedConverter.toTiptap.convert(embedNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to EmbedNode', () => {
    const actual = embedConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(embedNode);
  });
});
