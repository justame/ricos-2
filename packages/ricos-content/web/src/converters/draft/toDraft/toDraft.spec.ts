import { merge } from 'lodash';
import type { FileData, Node, RichContent } from 'ricos-schema';
import {
  Decoration_Type,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { convertDecorationDataToDraft, convertNodeDataToDraft, fromDraft, toDraft } from '..';
import anchorBlocksFixture from '../../../../../../../e2e/tests/fixtures/all-blocks-with-anchors.json';
import complexFixture from '../../../../../../../e2e/tests/fixtures/migration-content.json';
import { compare } from '../../../comparision/compare';
import { ANCHOR_TYPE, WRAP } from '../../../consts';
import { convertDecorationToDraftData, convertNodeToDraftData } from './convertDraftPluginData';
import keyAndBulletFixtureMigrated from './migration-content-with-key-and-bullet-migrated.json';
import keyAndBulletFixture from './migration-content-with-key-and-bullet.json';
import externalMigrated from './__tests__/external-blocks-and-decorations-migrated.json';
import external from './__tests__/external-blocks-and-decorations.json';
import nullishDocumentStyleDraft from './__tests__/nullishDocumentStyleDraft.json';
import nullishDocumentStyleRicos from './__tests__/nullishDocumentStyleRicos.json';

const fixtures = { complex: complexFixture };

describe('migrate to draft', () => {
  Object.entries(fixtures).forEach(([name, content]) =>
    it(`should migrate ${name} fixture`, () => {
      expect(compareWithConverted(content)).toEqual({});
    })
  );

  it('should migrate anchors', () => {
    const content = convert(anchorBlocksFixture);
    const anchorKeys = Object.values(content.entityMap)
      .filter(({ type }) => type === ANCHOR_TYPE)
      .map(({ data }) => data.anchor);
    const blockKeys = content.blocks.map(({ key }) => key);
    const anchorsWithoutBlock = anchorKeys.filter(anchor => !blockKeys.includes(anchor));
    expect(anchorsWithoutBlock.length).toEqual(0);
  });

  const imageNodeData = {
    nodes: [],
    type: Node_Type.IMAGE,
    id: 'eoba3',
    imageData: {
      containerData: {
        width: { size: PluginContainerData_Width_Type.CONTENT },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      image: {
        src: {
          custom: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
          private: false,
        },
        width: 2898,
        height: 3354,
      },
      disableExpand: false,
      altText: 'feet',
      caption: 'The caption!',
    },
  };

  const expectedImageBlockData = {
    config: {
      alignment: 'center',
      size: 'content',
      textWrap: WRAP,
    },
    disableExpand: false,
    src: {
      id: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
      file_name: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
      width: 2898,
      height: 3354,
    },
    metadata: {
      caption: 'The caption!',
      alt: 'feet',
    },
  };

  it('should convert node data', () => {
    const blockData = convertNodeDataToDraft(Node_Type.IMAGE, imageNodeData.imageData);

    expect(blockData).toEqual(expectedImageBlockData);
  });

  it('should convert node', () => {
    const blockData = convertNodeToDraftData(imageNodeData);

    expect(blockData).toEqual(expectedImageBlockData);
  });

  const videoData = {
    containerData: {
      width: { size: PluginContainerData_Width_Type.CONTENT },
    },
    video: { src: {} },
  };

  const expectedVideoBlockData = {
    config: {
      size: 'content',
      textWrap: WRAP,
    },
  };

  it('should convert video without src properly', () => {
    const blockData = convertNodeDataToDraft(Node_Type.VIDEO, videoData);
    expect(blockData).toEqual(expectedVideoBlockData);
  });

  describe('FileSource', () => {
    it('should convert node data with id as source', () => {
      const { custom, ...rest } = imageNodeData.imageData.image.src;
      const newImageNodeData = merge({}, imageNodeData, {
        imageData: { image: { src: { ...rest, id: custom } } },
      });

      const blockData = convertNodeToDraftData(newImageNodeData);

      expect(blockData).toEqual(expectedImageBlockData);
    });
    describe('private (FileUpload coverage)', () => {
      it(`should handle 'false'`, () => {
        const expectedBlockData = { id: 'abcdefg', privacy: 'public' };
        const fileData: FileData = { src: { id: 'abcdefg', private: false } };
        const nodeData: Node = {
          id: '1',
          type: Node_Type.FILE,
          nodes: [],
          fileData,
        };
        const blockData = convertNodeToDraftData(nodeData);
        expect(blockData).toEqual(expectedBlockData);
      });
      it(`should handle 'true'`, () => {
        const expectedBlockData = { id: 'abcdefg', privacy: 'private' };
        const fileData: FileData = { src: { id: 'abcdefg', private: true } };
        const nodeData: Node = {
          id: '1',
          type: Node_Type.FILE,
          nodes: [],
          fileData,
        };
        const blockData = convertNodeToDraftData(nodeData);
        expect(blockData).toEqual(expectedBlockData);
      });
      it(`should handle undefined`, () => {
        const expectedBlockData = { id: 'abcdefg' };
        const fileData: FileData = { src: { id: 'abcdefg' } };
        const nodeData: Node = {
          id: '1',
          type: Node_Type.FILE,
          nodes: [],
          fileData,
        };
        const blockData = convertNodeToDraftData(nodeData);
        expect(blockData).toEqual(expectedBlockData);
      });
    });
  });

  const mentionDecoration = {
    type: Decoration_Type.MENTION,
    mentionData: {
      name: 'Test One',
      slug: 'testone',
    },
  };

  const expectedMentionBlockData = {
    mention: {
      name: 'Test One',
      slug: 'testone',
    },
  };

  it('should convert decoration data', () => {
    const blockData = convertDecorationDataToDraft(
      Decoration_Type.MENTION,
      mentionDecoration.mentionData
    );

    expect(blockData).toEqual(expectedMentionBlockData);
  });

  it('should convert decoration', () => {
    const blockData = convertDecorationToDraftData(mentionDecoration);

    expect(blockData).toEqual(expectedMentionBlockData);
  });

  describe('migrate key and bullet list', () => {
    it('should not break keys', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content: any = {
        nodes: [
          {
            type: 'BULLET_LIST',
            key: 'foo',
            nodes: [
              {
                type: 'LIST_ITEM',
                key: 'bar',
                nodes: [
                  {
                    type: 'PARAGRAPH',
                    key: 'baz',
                    nodes: [],
                  },
                ],
              },
            ],
          },
        ],
      };
      const { blocks } = toDraft(content);
      expect(blocks[0].key).toEqual('baz');
      expect(blocks[0].type).toEqual('unordered-list-item');
    });

    it('should fix whole content', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const converted = toDraft(keyAndBulletFixture as any);
      expect(compare(converted, keyAndBulletFixtureMigrated, { ignoredKeys: ['ID'] })).toEqual({});
    });
  });

  describe('migrate documentStyle properly', () => {
    it('should work when documentStyle is null', () => {
      expect(
        compare(
          toDraft(nullishDocumentStyleRicos as unknown as RichContent),
          nullishDocumentStyleDraft,
          {
            ignoredKeys: ['ID'],
          }
        )
      ).toEqual({});
    });
  });
});

describe('toDraft EXTERNAL', () => {
  it('should migrate external node and decoration', () => {
    expect(
      compare(toDraft(external as unknown as RichContent), externalMigrated, {
        ignoredKeys: ['ID'],
      })
    ).toEqual({});
  });
});

const convert = content => toDraft(fromDraft(content));
const compareWithConverted = content => compare(convert(content), content);
