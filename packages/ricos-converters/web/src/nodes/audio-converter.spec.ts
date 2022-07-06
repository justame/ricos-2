import type { AudioNode } from 'ricos-content';
import {
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { audioConverter } from './audio-converter';

describe('audio converter', () => {
  const tiptapNode = {
    type: Node_Type.AUDIO,
    attrs: {
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        textWrap: true,
      },
      audio: {
        src: {
          id: 'mp3/f0f74f_35a1cdce4973490eac49e74c3244364d.mp3',
        },
        duration: 300,
      },
      disableDownload: true,
      coverImage: {
        src: {
          id: '8bb438_aab736569612405a8381d4965c769f51.jpg',
        },
        width: 5472,
        height: 3648,
      },
      name: 'Dear Fear',
      authorName: 'Kota',
      id: '123',
    },
  };

  const audioNode: AudioNode = {
    type: Node_Type.AUDIO,
    id: '123',
    nodes: [],
    audioData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      audio: {
        src: {
          id: 'mp3/f0f74f_35a1cdce4973490eac49e74c3244364d.mp3',
        },
        duration: 300,
      },
      disableDownload: true,
      coverImage: {
        src: {
          id: '8bb438_aab736569612405a8381d4965c769f51.jpg',
        },
        width: 5472,
        height: 3648,
      },
      name: 'Dear Fear',
      authorName: 'Kota',
    },
  };

  it('should convert AudioNode to TiptapNode', () => {
    const actual = audioConverter.toTiptap.convert(audioNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to AudioNode', () => {
    const actual = audioConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(audioNode);
  });
});
