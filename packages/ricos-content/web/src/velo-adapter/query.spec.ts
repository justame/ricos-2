import migrationContent from '../../statics/json/migratedFixtures/migration-content.json';
import { query } from './query';
import {
  RichContent,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
  Node,
  Decoration_Type,
  FontSizeData_fontType,
} from 'ricos-schema';
import { TextNode, VideoNode } from '../types/node-refined-types';

const videoUrl = 'https://www.youtube.com/watch?v=CoJ23XNHgG0';

const videoMock: VideoNode = {
  id: '4',
  nodes: [],
  type: Node_Type.VIDEO,
  videoData: {
    containerData: {
      alignment: PluginContainerData_Alignment.CENTER,
      textWrap: true,
      width: { size: PluginContainerData_Width_Type.CONTENT },
    },
    thumbnail: {
      height: 270,
      src: { url: 'https://i.ytimg.com/vi/BBu5codsO6Y/hqdefault.jpg' },
      width: 480,
    },
    title: 'iJustine | Create a Website with Wix Artificial Design Intelligence',
    video: { src: { url: videoUrl } },
  },
};

const videoMock_BiggerWidth: VideoNode = {
  id: '6',
  nodes: [],
  type: Node_Type.VIDEO,
  videoData: {
    containerData: {
      alignment: PluginContainerData_Alignment.CENTER,
      textWrap: true,
      width: { size: PluginContainerData_Width_Type.SMALL },
    },
    disableDownload: false,
    thumbnail: {
      height: 1080,
      src: { id: 'media/d3dd72_9397c7bfa03f4fa8920b16bdd667f73bf000.jpg' },
      width: 1920,
    },
    video: { src: { id: 'video/d3dd72_9397c7bfa03f4fa8920b16bdd667f73b/1080p/mp4/file.mp4' } },
  },
};

const textNodeMock: TextNode = {
  id: '',
  nodes: [],
  textData: {
    decorations: [
      {
        fontWeightValue: 700,
        type: Decoration_Type.BOLD,
      },
      {
        fontSizeData: {
          unit: FontSizeData_fontType.PX,
          value: 20,
        },
        type: Decoration_Type.FONT_SIZE,
      },
    ],
    text: 'Lorem ipsum dolor sit amet',
  },
  type: Node_Type.TEXT,
};

describe('query', () => {
  const content = (migrationContent as unknown) as RichContent;

  it('should return all results if no filtering was done', () => {
    const result = query({ nodes: [videoMock] }).find();
    expect(result[0].nodes).toStrictEqual<Node[]>([videoMock]);
  });

  it('should do eq', () => {
    const result = query(content)
      .eq('videoData.video.src.url', videoUrl)
      .find();
    expect(result).toStrictEqual<VideoNode[]>([videoMock]);
  });

  it('should do gt', () => {
    const result = query(content)
      .gt('videoData.thumbnail.width', 490)
      .find();
    expect(result).toStrictEqual<VideoNode[]>([videoMock_BiggerWidth]);
  });

  it('should do lt', () => {
    const result = query(content)
      .lt('videoData.thumbnail.width', 490)
      .find();
    expect(result).toStrictEqual<VideoNode[]>([videoMock]);
  });

  it('should do isEmpty - should keep relevant fields', () => {
    const result = query(content)
      .eq('videoData.video.src.url', videoUrl)
      .isEmpty('some.dummy.field.that.should.not.exist')
      .find();
    expect(result).toStrictEqual<Node[]>([videoMock]);
  });

  it('should do isEmpty - should filter for existing fields', () => {
    const result = query(content)
      .eq('videoData.video.src.url', videoUrl)
      .isEmpty('videoData.video.src.url')
      .find();
    expect(result).toStrictEqual<Node[]>([]);
  });

  it('should do isNotEmpty - should remove inexistent fields', () => {
    const result = query(content)
      .eq('videoData.video.src.url', videoUrl)
      .isNotEmpty('some.dummy.field.that.should.not.exist')
      .find();
    expect(result).toStrictEqual<Node[]>([]);
  });

  it('should do isNotEmpty - should keep existing fields', () => {
    const result = query(content)
      .eq('videoData.video.src.url', videoUrl)
      .isNotEmpty('videoData.video.src.url')
      .find();
    expect(result).toStrictEqual<Node[]>([videoMock]);
  });

  it('should do startsWith', () => {
    const result = query(content)
      .startsWith('textData.text', 'Lorem ipsum dolor')
      .find();
    expect(result).toStrictEqual<TextNode[]>([textNodeMock]);
  });

  it('should do endsWith', () => {
    const result = query(content)
      .endsWith('textData.text', 'sit amet')
      .find();
    expect(result).toStrictEqual<TextNode[]>([textNodeMock]);
  });

  it('should do limit', () => {
    const result = query(content)
      .limit(2)
      .find();
    expect(result.length).toStrictEqual<number>(2);
  });

  it('should do count', () => {
    const result = query(content).count();
    expect(result).toStrictEqual<number>(186);
  });

  it('should do count + limit', () => {
    const result = query(content)
      .limit(2)
      .count();
    expect(result).toStrictEqual<number>(2);
  });
});
