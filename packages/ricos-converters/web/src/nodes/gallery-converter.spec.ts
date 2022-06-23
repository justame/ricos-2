import type { GalleryNode } from 'ricos-content';
import {
  GalleryOptions_ItemStyle_Crop,
  GalleryOptions_Layout_Orientation,
  GalleryOptions_Layout_Type,
  GalleryOptions_Thumbnails_Alignment,
  Node_Type,
  PluginContainerData_Alignment,
  PluginContainerData_Width_Type,
} from 'ricos-schema';
import { ricosNodeVisitor, tiptapNodeVisitor } from '../tiptap-converters';
import { galleryConverter } from './gallery-converter';

describe('gallery converter', () => {
  const tiptapNode = {
    type: Node_Type.GALLERY,
    attrs: {
      items: [
        {
          image: {
            media: {
              src: {
                url: '8bb438_0ab44689f626435c94b9a5b996524aba.jpg',
              },
              width: 5600,
              height: 3733,
            },
          },
        },
        {
          image: {
            media: {
              src: {
                url: '8bb438_6a7159be0f944dde9098fe566bf22831.jpg',
              },
              width: 1920,
              height: 1922,
            },
          },
        },
        {
          video: {
            media: {
              src: {
                url: '0d72ac_31569a98fd8d436f98ae9c827c216443',
              },
              width: 1920,
              height: 1080,
            },
            thumbnail: {
              src: {
                url: '8bb438_cabd67053eae45e7ab273832504717ff.jpg',
              },
              width: 5600,
              height: 3727,
            },
          },
        },
      ],
      containerData: {
        alignment: PluginContainerData_Alignment.CENTER,
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        textWrap: true,
      },
      options: {
        layout: {
          type: GalleryOptions_Layout_Type.GRID,
          orientation: GalleryOptions_Layout_Orientation.ROWS,
          horizontalScroll: false,
          numberOfColumns: 3,
          mobileNumberOfColumns: 3,
        },
        item: {
          crop: 'FILL',
          targetSize: 300,
          ratio: 1,
          spacing: 20,
        },
        thumbnails: {
          placement: GalleryOptions_Thumbnails_Alignment.BOTTOM,
          spacing: 0,
        },
      },
      disableExpand: false,
      id: '8',
    },
  };

  const galleryNode: GalleryNode = {
    type: Node_Type.GALLERY,
    id: '8',
    nodes: [],
    galleryData: {
      containerData: {
        width: {
          size: PluginContainerData_Width_Type.CONTENT,
        },
        alignment: PluginContainerData_Alignment.CENTER,
        textWrap: true,
      },
      items: [
        {
          image: {
            media: {
              src: {
                url: '8bb438_0ab44689f626435c94b9a5b996524aba.jpg',
              },
              width: 5600,
              height: 3733,
            },
          },
        },
        {
          image: {
            media: {
              src: {
                url: '8bb438_6a7159be0f944dde9098fe566bf22831.jpg',
              },
              width: 1920,
              height: 1922,
            },
          },
        },
        {
          video: {
            media: {
              src: {
                url: '0d72ac_31569a98fd8d436f98ae9c827c216443',
              },
              width: 1920,
              height: 1080,
            },
            thumbnail: {
              src: {
                url: '8bb438_cabd67053eae45e7ab273832504717ff.jpg',
              },
              width: 5600,
              height: 3727,
            },
          },
        },
      ],
      options: {
        layout: {
          type: GalleryOptions_Layout_Type.GRID,
          horizontalScroll: false,
          orientation: GalleryOptions_Layout_Orientation.ROWS,
          numberOfColumns: 3,
          mobileNumberOfColumns: 3,
        },
        item: {
          targetSize: 300,
          ratio: 1,
          crop: GalleryOptions_ItemStyle_Crop.FILL,
          spacing: 20,
        },
        thumbnails: {
          placement: GalleryOptions_Thumbnails_Alignment.BOTTOM,
          spacing: 0,
        },
      },
      disableExpand: false,
    },
  };

  it('should convert GalleryNode to TiptapNode', () => {
    const actual = galleryConverter.toTiptap.convert(galleryNode, ricosNodeVisitor);
    expect(actual).toEqual(tiptapNode);
  });

  it('should convert TiptapNode to GalleryNode', () => {
    const actual = galleryConverter.fromTiptap.convert(tiptapNode, tiptapNodeVisitor);
    expect(actual).toEqual(galleryNode);
  });
});
