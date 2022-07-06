import type { VideoNode } from 'ricos-content';
import {
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { videoConverter } from './video-converter';

describe('VideoNode converter', () => {
  const tiptapNode = {
    type: Node_Type.VIDEO,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        textWrap: true,
      },
      video: {
        src: {
          url: 'https://www.youtube.com/watch?v=CoJ23XNHgG0',
        },
        duration: 14,
      },
      thumbnail: {
        src: {
          url: 'https://i.ytimg.com/vi/BBu5codsO6Y/hqdefault.jpg',
        },
        width: 480,
        height: 270,
      },
      title: 'iJustine | Create a Website with Wix Artificial Design Intelligence',
      id: '4',
    },
  };

  const videoNode: VideoNode = {
    type: Node_Type.VIDEO,
    id: '4',
    nodes: [],
    videoData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      video: {
        src: {
          url: 'https://www.youtube.com/watch?v=CoJ23XNHgG0',
        },
        duration: 14,
      },
      thumbnail: {
        src: {
          url: 'https://i.ytimg.com/vi/BBu5codsO6Y/hqdefault.jpg',
        },
        width: 480,
        height: 270,
      },
      title: 'iJustine | Create a Website with Wix Artificial Design Intelligence',
    },
  };

  it('should convert VideoNode to TiptapNode', () => {
    const actual = videoConverter.toTiptap.convert(videoNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to VideoNode', () => {
    const actual = videoConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(videoNode);
  });
});
