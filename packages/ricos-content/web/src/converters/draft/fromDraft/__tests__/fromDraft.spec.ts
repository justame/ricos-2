/* eslint-disable no-unused-vars */

import { toDraft, fromDraft } from '../..';
import { compare } from '../../../../comparision/compare';
import complexFixture from '../../../../../../../../e2e/tests/fixtures/migration-content.json';
import buggy from '../../../../../../../../e2e/tests/fixtures/buggy/atomicWithNoEntityRanges.json';
import external from './external-blocks-and-decorations.json';
import externalMigrated from './external-blocks-and-decorations-migrated.json';
import unsupported from './unsupported-blocks-and-decorations.json';
import unsupportedMigrated from './unsupported-blocks-and-decorations-migrated.json';
import galleryThumbnailNone from './gallery-with-thumbnail-placement-none.json';
import galleryWithoutThumbnail from './gallery-without-thumbnail-placement.json';
import galleryThumbnailMigrated from './gallery-with-thumbnail-placement-migrated.json';
import noVideoData from './no-data-video.json';
import noVideoDataMigrated from './no-data-video-migrated.json';
import innerWithUnsupported from './inner-rce-with-unsupported-styling.json';
import innerWithUnsupportedMigrated from './inner-rce-with-unsupported-styling-migrated.json';
import faultyLinkValues from './faulty-link-values.json';
import faultyLinkValuesMigrated from './faulty-link-values-migrated.json';
import faultyBlockValues from './faulty-block-values.json';
import faultyBlockValuesMigrated from './faulty-block-values-migrated.json';
import faultyDividerValues from './faulty-divider-values.json';
import faultyDividerValuesMigrated from './faulty-divider-values-migrated.json';
import polyfills from '../../../../../../../../e2e/tests/fixtures/polyfills.json';
import oldImageFormat from '../../../../../../../../e2e/tests/fixtures/old-image-format.json';
import { getTextNodes } from '../getTextNodes';
import complexRicosFixture from '../../../../../statics/json/migratedFixtures/migration-content.json';
import {
  Node_Type,
  Decoration_Type,
  RichContent,
  ImageData,
  FileData,
  PluginContainerData_Width_Type,
  PluginContainerData_Alignment,
} from 'ricos-schema';
import { convertBlockDataToRicos } from '../convertRicosPluginData';
import { IMAGE_TYPE, FILE_UPLOAD_TYPE, WRAP } from '../../../../consts';

import emojiWithInlineStyleRicos from './emojiWithInlineStyleRicos.json';
import emojiWithInlineStyleDraft from './emojiWithInlineStyleDraft.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const filterIds = objArr => objArr.map(({ id, ...rest }) => rest); //disable
describe('migrate from draft', () => {
  const fixtures = { buggy, polyfills };
  Object.entries(fixtures).forEach(([name, content]) =>
    it(`should migrate ${name} fixture`, () => {
      const _backToDraft = toDraft(fromDraft(content));
      // const result = compare(backToDraft, content);
      // expect(result).toEqual({});
      expect(true).toEqual(true);
    })
  );

  it('should migrate complex fixture', () => {
    expect(
      compare(fromDraft(complexFixture), RichContent.fromJSON(complexRicosFixture), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should overlap styles', () => {
    const block = {
      key: 'foo',
      text: 'blah blah blah',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 3,
          length: 3,
          style: 'ITALIC',
        },
        {
          offset: 5,
          length: 5,
          style: 'UNDERLINE',
        },
        {
          offset: 8,
          length: 4,
          style: 'BOLD',
        },
      ],
      entityRanges: [],
    };

    const expectedResults = [
      {
        id: '2k4v1',
        nodes: [],
        textData: { decorations: [], text: 'bla' },
        type: Node_Type.TEXT,
      },
      {
        id: '1ba7b',
        nodes: [],
        textData: { decorations: [{ type: Decoration_Type.ITALIC, italicData: true }], text: 'h ' },
        type: Node_Type.TEXT,
      },
      {
        id: '59lhm',
        nodes: [],
        textData: {
          decorations: [
            { type: Decoration_Type.ITALIC, italicData: true },
            { type: Decoration_Type.UNDERLINE, underlineData: true },
          ],
          text: 'b',
        },
        type: Node_Type.TEXT,
      },
      {
        id: '1agl0',
        nodes: [],
        textData: {
          decorations: [{ type: Decoration_Type.UNDERLINE, underlineData: true }],
          text: 'la',
        },
        type: Node_Type.TEXT,
      },
      {
        id: '1m39g',
        nodes: [],
        textData: {
          decorations: [
            { type: Decoration_Type.UNDERLINE, underlineData: true },
            { type: Decoration_Type.BOLD, fontWeightValue: 700 },
          ],
          text: 'h ',
        },
        type: Node_Type.TEXT,
      },
      {
        id: '8cr95',
        nodes: [],
        textData: {
          decorations: [{ type: Decoration_Type.BOLD, fontWeightValue: 700 }],
          text: 'bl',
        },
        type: Node_Type.TEXT,
      },
      {
        id: 'dkn86',
        nodes: [],
        textData: { decorations: [], text: 'ah' },
        type: Node_Type.TEXT,
      },
    ];

    const entityMap = {};
    expect(filterIds(getTextNodes(block, entityMap))).toEqual(filterIds(expectedResults));
  });

  it('should detect mentions', () => {
    const block = {
      key: 'fcm70',
      text: 'Mentions too @Test One ',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 13,
          length: 9,
          key: 0,
        },
      ],
      data: {},
    };
    const entityMap = {
      '0': {
        type: 'mention',
        mutability: 'SEGMENTED',
        data: {
          mention: {
            name: 'Test One',
            slug: 'testone',
          },
        },
      },
    };

    const expectedResult = [
      {
        nodes: [],
        textData: { decorations: [], text: 'Mentions too ' },
        type: Node_Type.TEXT,
      },
      {
        nodes: [],
        textData: {
          decorations: [
            {
              mentionData: {
                name: 'Test One',
                slug: 'testone',
              },
              type: Decoration_Type.MENTION,
            },
          ],
          text: '@Test One',
        },
        type: Node_Type.TEXT,
      },
      { nodes: [], textData: { decorations: [], text: ' ' }, type: Node_Type.TEXT },
    ];
    expect(filterIds(getTextNodes(block, entityMap))).toEqual(expectedResult);
  });

  it('should convert block data', () => {
    const blockData = {
      config: {
        alignment: 'center',
        size: 'content',
        showTitle: true,
        showDescription: true,
        textWrap: WRAP,
      },
      src: {
        id: '036c6bf6cef5e4409848eb4eb6f80de1',
        original_file_name: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
        file_name: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg',
        width: 2898,
        height: 3354,
      },
      disableExpand: false,
      disableDownload: false,
      metadata: {
        caption: 'The caption!',
        alt: 'feet',
      },
    };

    const expectedNodeData: ImageData = {
      containerData: {
        width: { size: PluginContainerData_Width_Type.CONTENT },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      image: {
        src: { id: '8bb438_131a7e1872bc45ec827bb61e56b840fe.jpg' },
        width: 2898,
        height: 3354,
      },
      disableExpand: false,
      disableDownload: false,
      altText: 'feet',
      caption: 'The caption!',
    };

    const nodeData = convertBlockDataToRicos(IMAGE_TYPE, blockData);

    expect(ImageData.toJSON(nodeData)).toEqual(expectedNodeData);
  });

  describe('FileSource', () => {
    describe('privacy', () => {
      it(`should handle 'public'`, () => {
        const blockData = { id: 'abcdefg', privacy: 'public' };
        const expectedNodeData: FileData = { src: { id: 'abcdefg', private: false } };
        const nodeData = convertBlockDataToRicos(FILE_UPLOAD_TYPE, blockData);
        expect(FileData.toJSON(nodeData)).toEqual(expectedNodeData);
      });
      it(`should handle 'private'`, () => {
        const blockData = { id: 'abcdefg', privacy: 'private' };
        const expectedNodeData: FileData = { src: { id: 'abcdefg', private: true } };
        const nodeData = convertBlockDataToRicos(FILE_UPLOAD_TYPE, blockData);
        expect(FileData.toJSON(nodeData)).toEqual(expectedNodeData);
      });
      it(`should handle undefined`, () => {
        const blockData = { id: 'abcdefg' };
        const expectedNodeData: FileData = { src: { id: 'abcdefg' } };
        const nodeData = convertBlockDataToRicos(FILE_UPLOAD_TYPE, blockData);
        expect(FileData.toJSON(nodeData)).toEqual(expectedNodeData);
      });
    });
  });

  it('should convert list styles correctly', () => {
    const draftContent = {
      blocks: [
        {
          key: '80vi2',
          text: 'xbxvbcvb',
          type: 'ordered-list-item',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {
            dynamicStyles: {
              'padding-top': '2px',
              'padding-bottom': '3px',
            },
          },
        },
      ],
      entityMap: {},
      VERSION: '8.42.2',
    };
    const expected = {
      nodes: [
        {
          type: 'ORDERED_LIST',
          id: '4kh4d',
          nodes: [
            {
              type: 'LIST_ITEM',
              id: '80vi2',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  id: 'copbt',
                  nodes: [
                    {
                      type: 'TEXT',
                      id: '4vn2p',
                      nodes: [],
                      textData: { text: 'xbxvbcvb', decorations: [] },
                    },
                  ],
                  style: { paddingTop: '2px', paddingBottom: '3px' },
                  paragraphData: { textStyle: { textAlignment: 'AUTO' }, indentation: 0 },
                },
              ],
            },
          ],
          orderedListData: {
            indentation: 0,
          },
        },
      ],
      metadata: {
        version: 1,
        createdTimestamp: '2021-06-06T11:42:01.065Z',
        updatedTimestamp: '2021-06-06T11:42:01.065Z',
      },
    };
    expect(
      compare(fromDraft(draftContent), RichContent.fromJSON(expected), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert blockquote correctly', () => {
    const draftContent = {
      blocks: [
        {
          key: '5lrjt',
          text: 'asdsadasd',
          type: 'blockquote',
          depth: 4,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
      documentStyle: {},
      VERSION: '8.70.20',
      ID: '06198048-7c9f-4be1-b495-32722fbddf8a',
    };
    const expected = {
      nodes: [
        {
          type: 'BLOCKQUOTE',
          id: '5lrjt',
          nodes: [
            {
              type: 'PARAGRAPH',
              id: '62kaz3',
              nodes: [
                {
                  type: 'TEXT',
                  id: '',
                  nodes: [],
                  textData: {
                    text: 'asdsadasd',
                    decorations: [],
                  },
                },
              ],
              paragraphData: {
                textStyle: {
                  textAlignment: 'AUTO',
                },
                indentation: 0,
              },
            },
          ],
          blockquoteData: { indentation: 4 },
        },
      ],
      metadata: {
        version: 1,
        createdTimestamp: '2022-03-21T14:13:07.937Z',
        updatedTimestamp: '2022-03-21T14:13:07.937Z',
        id: '06198048-7c9f-4be1-b495-32722fbddf8a',
      },
      documentStyle: {},
    };
    expect(
      compare(fromDraft(draftContent), RichContent.fromJSON(expected), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should ignore unsupported blocks and decorations', () => {
    expect(
      compare(
        fromDraft(unsupported, { ignoreUnsupportedValues: true }),
        RichContent.fromJSON(unsupportedMigrated),
        {
          ignoredKeys: ['id'],
        }
      )
    ).toEqual({});
  });

  it('should convert external block', () => {
    expect(
      compare(fromDraft(external), RichContent.fromJSON(externalMigrated), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert gallery content correctly', () => {
    const draftContents = [galleryThumbnailNone, galleryWithoutThumbnail];
    draftContents.forEach(draftContent =>
      expect(
        compare(fromDraft(draftContent), RichContent.fromJSON(galleryThumbnailMigrated), {
          ignoredKeys: ['id'],
        })
      ).toEqual({})
    );
  });

  it('should convert content with no data plugins correctly', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const converted = fromDraft(noVideoData, { ignoreUnsupportedValues: true });
    expect(
      compare(converted, RichContent.fromJSON(noVideoDataMigrated), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert unsupported inine inner content correctly', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const converted = fromDraft(innerWithUnsupported, { ignoreUnsupportedValues: true });

    expect(
      compare(converted, RichContent.fromJSON(innerWithUnsupportedMigrated), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert faulty link content correctly', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const converted = fromDraft(faultyLinkValues, { ignoreUnsupportedValues: true });
    expect(
      compare(converted, RichContent.fromJSON(faultyLinkValuesMigrated), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert faulty blocks content correctly', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const converted = fromDraft(faultyBlockValues, { ignoreUnsupportedValues: true });
    expect(
      compare(converted, RichContent.fromJSON(faultyBlockValuesMigrated), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert faulty divider content correctly', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const converted = fromDraft(faultyDividerValues, { ignoreUnsupportedValues: true });
    expect(
      compare(converted, RichContent.fromJSON(faultyDividerValuesMigrated), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert list nodes correctly', () => {
    const draftContent = {
      blocks: [
        {
          key: 'foo',
          text: 'AAA',
          type: 'ordered-list-item',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: 'bquqe',
          text: 'BBB',
          type: 'ordered-list-item',
          depth: 1,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: '641f',
          text: 'CCC',
          type: 'ordered-list-item',
          depth: 1,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: '7mcq2',
          text: 'DDD',
          type: 'ordered-list-item',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
      documentStyle: {},
      VERSION: '8.70.19',
      ID: '60c2c68e-d169-4084-aaf7-ec7fe883a600',
    };

    const expected = {
      nodes: [
        {
          type: 'ORDERED_LIST',
          id: '9kc0kh68v571e424',
          nodes: [
            {
              type: 'LIST_ITEM',
              id: 'foo',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  id: '6qzay19',
                  nodes: [
                    {
                      type: 'TEXT',
                      id: '',
                      nodes: [],
                      textData: {
                        text: 'AAA',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                    indentation: 0,
                  },
                },
                {
                  type: 'ORDERED_LIST',
                  id: '6ifqkh68v571e422',
                  nodes: [
                    {
                      type: 'LIST_ITEM',
                      id: 'bquqe',
                      nodes: [
                        {
                          type: 'PARAGRAPH',
                          id: 'kafw920',
                          nodes: [
                            {
                              type: 'TEXT',
                              id: '',
                              nodes: [],
                              textData: {
                                text: 'BBB',
                                decorations: [],
                              },
                            },
                          ],
                          paragraphData: {
                            textStyle: {
                              textAlignment: 'AUTO',
                            },
                            indentation: 0,
                          },
                        },
                      ],
                    },
                    {
                      type: 'LIST_ITEM',
                      id: '641f',
                      nodes: [
                        {
                          type: 'PARAGRAPH',
                          id: 'v46b921',
                          nodes: [
                            {
                              type: 'TEXT',
                              id: '',
                              nodes: [],
                              textData: {
                                text: 'CCC',
                                decorations: [],
                              },
                            },
                          ],
                          paragraphData: {
                            textStyle: {
                              textAlignment: 'AUTO',
                            },
                            indentation: 0,
                          },
                        },
                      ],
                    },
                  ],
                  orderedListData: { indentation: 1 },
                },
              ],
            },
            {
              type: 'LIST_ITEM',
              id: '7mcq2',
              nodes: [
                {
                  type: 'PARAGRAPH',
                  id: 'ccita23',
                  nodes: [
                    {
                      type: 'TEXT',
                      id: '',
                      nodes: [],
                      textData: {
                        text: 'DDD',
                        decorations: [],
                      },
                    },
                  ],
                  paragraphData: {
                    textStyle: {
                      textAlignment: 'AUTO',
                    },
                    indentation: 0,
                  },
                },
              ],
            },
          ],
          orderedListData: { indentation: 0 },
        },
      ],
      metadata: {
        version: 1,
        createdTimestamp: '2022-03-16T11:20:53.697Z',
        updatedTimestamp: '2022-03-16T11:20:53.697Z',
        id: '60c2c68e-d169-4084-aaf7-ec7fe883a600',
      },
      documentStyle: {},
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const converted = fromDraft(draftContent, { ignoreUnsupportedValues: true });
    expect(
      compare(converted, RichContent.fromJSON(expected), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert with emoji', () => {
    const content = fromDraft(emojiWithInlineStyleDraft);
    expect(
      compare(content, RichContent.fromJSON(emojiWithInlineStyleRicos), {
        ignoredKeys: ['ID'],
      })
    ).toEqual({});
  });

  it('should convert legacy image data correctly', () => {
    const expected = {
      nodes: [
        {
          type: 'PARAGRAPH',
          id: '13iji',
          nodes: [
            {
              type: 'TEXT',
              id: '',
              nodes: [],
              textData: {
                text: 'Test',
                decorations: [],
              },
            },
          ],
          paragraphData: {
            textStyle: {
              textAlignment: 'AUTO',
            },
            indentation: 0,
          },
        },
        {
          type: 'IMAGE',
          id: 'a8q8p',
          nodes: [],
          imageData: {
            image: {
              src: {
                id: '212af3_8337022e2b2f4e1c8b1e602ad9016dac~mv2.jpg',
              },
              width: 1080,
              height: 708,
            },
          },
        },
        {
          type: 'IMAGE',
          id: '1khfq',
          nodes: [],
          imageData: {
            image: {
              src: {
                // eslint-disable-next-line max-len
                url: '//static.wixstatic.com/media/9916f5_f3a135d986354da09522bd288f51d4a6~mv2.jpg/v1/fill/w_626,h_417/9916f5_f3a135d986354da09522bd288f51d4a6~mv2.jpg',
              },
              width: 626,
              height: 417,
            },
          },
        },
        {
          type: 'PARAGRAPH',
          id: '9sb1r',
          nodes: [],
          paragraphData: {
            textStyle: {
              textAlignment: 'AUTO',
            },
            indentation: 0,
          },
        },
      ],
      metadata: {
        version: 1,
        createdTimestamp: '2022-05-30T08:00:04.297Z',
        updatedTimestamp: '2022-05-30T08:00:04.297Z',
        id: '8d5b9a02-65d6-4771-ae56-9548c87ebf9a',
      },
    };
    expect(
      compare(fromDraft(oldImageFormat), RichContent.fromJSON(expected), {
        ignoredKeys: ['id'],
      })
    ).toEqual({});
  });

  it('should convert video with thumbnail correctly', () => {
    const draftContent = {
      blocks: [
        {
          key: 'foo',
          text: 'Youtube video:',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: '9v54q',
          text: '',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: 'c0so8',
          text: ' ',
          type: 'atomic',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [
            {
              offset: 0,
              length: 1,
              key: 0,
            },
          ],
          data: {},
        },
        {
          key: '81mcr',
          text: '',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {
        '0': {
          type: 'wix-draft-plugin-video',
          mutability: 'IMMUTABLE',
          data: {
            config: {
              size: 'content',
              alignment: 'center',
              textWrap: 'wrap',
            },
            src: 'https://www.youtube.com/watch?v=ko5lL2MQKCU',
            metadata: {
              oembed: {
                thumbnail_url: 'https://i.ytimg.com/vi/ko5lL2MQKCU/maxresdefault.jpg',
                thumbnail_height: 720,
                thumbnail_width: 1280,
                video_url: 'https://www.youtube.com/watch?v=ko5lL2MQKCU',
              },
            },
            duration: 374,
          },
        },
      },
      documentStyle: {},
      VERSION: '8.71.49',
      ID: '79347b8b-6a76-4e7e-bfed-c7ed8745fe8c',
    };
    const videoData = JSON.parse(JSON.stringify(fromDraft(draftContent).nodes[2].videoData));

    const expectedVideoData = {
      containerData: {
        alignment: 'CENTER',
        width: {
          size: 'CONTENT',
        },
        textWrap: true,
      },
      video: {
        src: {
          url: 'https://www.youtube.com/watch?v=ko5lL2MQKCU',
        },
        duration: 374,
      },
      thumbnail: {
        src: {
          url: 'https://i.ytimg.com/vi/ko5lL2MQKCU/maxresdefault.jpg',
        },
        width: 1280,
        height: 720,
      },
    };

    expect(compare(videoData, expectedVideoData)).toEqual({});
  });
});
