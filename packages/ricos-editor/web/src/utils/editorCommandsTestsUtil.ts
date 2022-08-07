/* eslint-disable no-unused-vars */
import {
  RICOS_DIVIDER_TYPE,
  RICOS_GIPHY_TYPE,
  RICOS_HTML_TYPE,
  RICOS_GALLERY_TYPE,
  RICOS_POLL_TYPE,
  RICOS_VIDEO_TYPE,
  RICOS_FILE_TYPE,
  RICOS_IMAGE_TYPE,
  RICOS_LINK_TYPE,
  RICOS_MENTION_TYPE,
  RICOS_TEXT_COLOR_TYPE,
  RICOS_TEXT_HIGHLIGHT_TYPE,
  WRAP,
  NO_WRAP,
  RICOS_FONT_SIZE_TYPE,
} from 'ricos-content';
import {
  DividerData,
  DividerData_LineStyle,
  GIFData,
  HTMLData,
  GalleryData,
  PollData,
  VideoData,
  FileData,
  ImageData,
  LinkData,
  Node_Type,
  MentionData,
  PluginContainerData_Width_Type,
  PluginContainerData_Alignment,
} from 'ricos-schema';

export const content = {
  blocks: [
    {
      key: 'o12',
      text: 'asdasdsa',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
  VERSION: '8.17.11',
};

export const contentWithDocumentStyleTest = {
  blocks: [
    {
      key: 'o12',
      text: 'asdasdsa',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
  documentStyle: {
    paragraph: {
      color: 'color3',
      'background-color': 'color2',
      'font-weight': 'bold',
      'font-style': 'italic',
    },
  },
  VERSION: '8.17.11',
};

export const blockKey = 'o12';

export const selection = {
  anchorKey: blockKey,
  focusKey: blockKey,
  anchorOffset: 0,
  focusOffset: 8,
};

export const selectionCollapsed = {
  anchorKey: blockKey,
  focusKey: blockKey,
  anchorOffset: 3,
  focusOffset: 3,
};

export const endOfSelection = {
  anchorKey: blockKey,
  focusKey: blockKey,
  anchorOffset: 8,
  focusOffset: 8,
};

export const mentionSelection = {
  anchorKey: blockKey,
  focusKey: blockKey,
  anchorOffset: 10,
  focusOffset: 10,
};

const divider = {
  type: RICOS_DIVIDER_TYPE,
  nodeType: Node_Type.DIVIDER,
  data1: DividerData.fromJSON({
    lineStyle: DividerData_LineStyle.DOUBLE,
  }),
  data2: DividerData.fromJSON({
    lineStyle: DividerData_LineStyle.DASHED,
  }),
  expectedData1: {
    type: 'double',
    config: { size: 'large', alignment: 'center', textWrap: NO_WRAP },
  },
  expectedData2: {
    type: 'dashed',
    config: { size: 'large', alignment: 'center', textWrap: NO_WRAP },
  },
};

const giphy = {
  type: RICOS_GIPHY_TYPE,
  nodeType: Node_Type.GIF,
  data1: GIFData.fromJSON({
    containerData: {},
    original: {
      gif: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.gif',
      mp4: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.mp4',
      still: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy_s.gif',
    },
    downsized: {
      gif: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.gif',
      mp4: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy-downsized-small.mp4',
      still: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy_s.gif',
    },
    height: 500,
    width: 500,
  }),
  data2: GIFData.fromJSON({
    containerData: {},
    original: {
      gif: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.gif',
      mp4: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.mp4',
      still: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy_s.gif',
    },
    downsized: {
      gif: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.gif',
      mp4: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy-downsized-small.mp4',
      still: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy_s.gif',
    },
    height: 300,
    width: 300,
  }),
  expectedData1: {
    config: {
      alignment: 'center',
      size: 'content',
      textWrap: WRAP,
    },
    configViewer: {
      sizes: {
        desktop: 'original',
        mobile: 'original',
      },
    },
    gif: {
      downsizedSmallMp4: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy-downsized-small.mp4',
      downsizedStillUrl: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy_s.gif',
      downsizedUrl: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.gif',
      height: 500,
      originalMp4: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.mp4',
      originalUrl: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.gif',
      stillUrl: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy_s.gif',
      width: 500,
    },
  },
  expectedData2: {
    config: {
      alignment: 'center',
      size: 'content',
      textWrap: WRAP,
    },
    configViewer: {
      sizes: {
        desktop: 'original',
        mobile: 'original',
      },
    },
    gif: {
      downsizedSmallMp4: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy-downsized-small.mp4',
      downsizedStillUrl: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy_s.gif',
      downsizedUrl: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.gif',
      height: 300,
      originalMp4: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.mp4',
      originalUrl: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy.gif',
      stillUrl: 'https://media2.giphy.com/media/wZcio4ufvvdde/giphy_s.gif',
      width: 300,
    },
  },
};

const html = {
  type: RICOS_HTML_TYPE,
  nodeType: Node_Type.HTML,
  data1: HTMLData.fromJSON({ url: 'www.wix.com', containerData: {} }),
  data2: HTMLData.fromJSON({ url: 'www.sport5.co.il', containerData: {} }),
  expectedData1: {
    config: {
      alignment: 'center',
      height: 550,
      width: 0,
      textWrap: WRAP,
    },
    src: 'www.wix.com',
    srcType: 'url',
  },
  expectedData2: {
    config: {
      alignment: 'center',
      textWrap: WRAP,
    },
    src: 'www.sport5.co.il',
    srcType: 'url',
  },
};

const gallery = {
  type: RICOS_GALLERY_TYPE,
  nodeType: Node_Type.GALLERY,
  data1: GalleryData.fromJSON({
    containerData: {},
    items: [
      {
        image: {
          media: {
            src: {
              url: '8bb438_a3a11b05e3f54f77ba1c04dfba22c99c.jpg',
            },
            height: 3497,
            width: 5000,
          },
        },
      },
      {
        image: {
          media: {
            src: {
              url: '8bb438_f89f7e8aac574a0f962437d4f369b37a.jpg',
            },
            height: 3733,
            width: 5600,
          },
        },
      },
      {
        image: {
          media: {
            src: {
              url: '8bb438_a132b18dea524d48a68a37f0075fcc1e.jpg',
            },
            height: 3727,
            width: 5600,
          },
        },
      },
    ],
    options: {
      layout: {
        type: 'GRID',
        horizontalScroll: false,
        orientation: 'ROWS',
        numberOfColumns: 3,
      },
      item: {
        targetSize: 300,
        ratio: 1,
        crop: 'FILL',
        spacing: 5,
      },
      thumbnails: {
        placement: 'BOTTOM',
        spacing: 0,
      },
    },
  }),
  data2: GalleryData.fromJSON({
    containerData: {},
    items: [
      {
        image: {
          media: {
            src: {
              url: '8bb438_a132b18dea524d48a68a37f0075fcc1e.jpg',
            },
            height: 3727,
            width: 5600,
          },
        },
      },
    ],
    options: {
      layout: {
        type: 'GRID',
        horizontalScroll: false,
        orientation: 'ROWS',
        numberOfColumns: 3,
      },
      item: {
        targetSize: 300,
        ratio: 1,
        crop: 'FILL',
        spacing: 5,
      },
      thumbnails: {
        placement: 'BOTTOM',
        spacing: 0,
      },
    },
  }),
  expectedData1: {
    config: {
      alignment: 'center',
      size: 'content',
      textWrap: WRAP,
    },
    items: [
      {
        metadata: {
          height: 3497,
          type: 'image',
          width: 5000,
        },
        url: '8bb438_a3a11b05e3f54f77ba1c04dfba22c99c.jpg',
      },
      {
        metadata: {
          height: 3733,
          type: 'image',
          width: 5600,
        },
        url: '8bb438_f89f7e8aac574a0f962437d4f369b37a.jpg',
      },
      {
        metadata: {
          height: 3727,
          type: 'image',
          width: 5600,
        },
        url: '8bb438_a132b18dea524d48a68a37f0075fcc1e.jpg',
      },
    ],
    styles: {
      cubeRatio: 1,
      cubeType: 'fill',
      galleryLayout: 2,
      gallerySizePx: 300,
      galleryThumbnailsAlignment: 'bottom',
      numberOfImagesPerRow: 3,
      imageMargin: 5,
      isVertical: false,
      oneRow: false,
      thumbnailSpacings: 0,
    },
  },
  expectedData2: {
    config: {
      alignment: 'center',
      size: 'content',
      textWrap: WRAP,
    },
    items: [
      {
        metadata: {
          height: 3727,
          type: 'image',
          width: 5600,
        },
        url: '8bb438_a132b18dea524d48a68a37f0075fcc1e.jpg',
      },
    ],
    styles: {
      cubeRatio: 1,
      cubeType: 'fill',
      galleryLayout: 2,
      gallerySizePx: 300,
      galleryThumbnailsAlignment: 'bottom',
      numberOfImagesPerRow: 3,
      imageMargin: 5,
      isVertical: false,
      oneRow: false,
      thumbnailSpacings: 0,
    },
  },
};

// TODO: check about expected data
const poll = {
  type: RICOS_POLL_TYPE,
  nodeType: Node_Type.POLL,
  data1: PollData.fromJSON({
    config: {},
    poll: {},
    design: {},
    layout: {},
  }),
  data2: PollData.fromJSON({
    config: {},
    poll: {},
    design: {},
    layout: {},
  }),
  expectedData1: {},
  expectedData2: {},
};

// TODO: check about expected data
const video = {
  type: RICOS_VIDEO_TYPE,
  nodeType: Node_Type.VIDEO,
  data1: VideoData.fromJSON({
    url: 'https://www.youtube.com/watch?v=2iDTAGKkixE&ab_channel=QueenClub',
  }),
  data2: VideoData.fromJSON({
    url: 'https://www.youtube.com/watch?v=tIA_vrBDC1g&ab_channel=BoyceAvenue',
  }),
  expectedData1: {},
  expectedData2: {},
};

const file = {
  type: RICOS_FILE_TYPE,
  nodeType: Node_Type.FILE,
  data1: FileData.fromJSON({
    src: { url: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    name: 'File sample',
    containerData: {
      width: { size: PluginContainerData_Width_Type.SMALL },
      alignment: PluginContainerData_Alignment.LEFT,
    },
  }),
  data2: FileData.fromJSON({
    src: { url: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    name: 'Updated file sample',
    containerData: {
      width: { size: PluginContainerData_Width_Type.CONTENT },
      alignment: PluginContainerData_Alignment.RIGHT,
    },
  }),
  expectedData1: {
    url: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    name: 'File sample',
    config: {
      size: 'small',
      alignment: 'left',
      textWrap: WRAP,
    },
    configViewer: {
      downloadTarget: '_blank',
    },
  },
  expectedData2: {
    url: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    name: 'Updated file sample',
    config: {
      size: 'content',
      alignment: 'right',
      textWrap: WRAP,
    },
    configViewer: {
      downloadTarget: '_blank',
    },
  },
};

const image = {
  type: RICOS_IMAGE_TYPE,
  nodeType: Node_Type.IMAGE,
  data1: ImageData.fromJSON({
    containerData: {},
    image: {
      src: { custom: '8bb438_1b73a6b067b24175bd087e86613bd00c.jpg' },
      width: 1920,
      height: 1000,
    },
  }),
  data2: ImageData.fromJSON({
    containerData: {
      alignment: PluginContainerData_Alignment.LEFT,
    },
    image: {
      src: { custom: '8bb438_92b217c36c98400a82e5c59bf131d957.jpg' },
      width: 1600,
      height: 1068,
    },
  }),
  expectedData1: {
    config: {
      alignment: 'center',
      showDescription: true,
      showTitle: true,
      size: 'content',
      textWrap: WRAP,
    },
    src: {
      file_name: '8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
      height: 1000,
      id: '8bb438_1b73a6b067b24175bd087e86613bd00c.jpg',
      width: 1920,
    },
  },
  expectedData2: {
    config: {
      alignment: 'left',
      showDescription: true,
      showTitle: true,
      size: 'content',
      textWrap: WRAP,
    },
    src: {
      file_name: '8bb438_92b217c36c98400a82e5c59bf131d957.jpg',
      height: 1068,
      id: '8bb438_92b217c36c98400a82e5c59bf131d957.jpg',
      width: 1600,
    },
  },
};

const link = {
  type: RICOS_LINK_TYPE,
  data1: LinkData.fromJSON({
    link: {
      url: 'www.wix.com',
      rel: { nofollow: true },
      target: 'SELF',
    },
  }),
  selection1: selection,
  data2: LinkData.fromJSON({
    link: {
      url: 'www.sport5.co.il',
      rel: { sponsored: true },
      target: 'SELF',
    },
  }),
  selection2: selectionCollapsed,
  expectedData1: { url: 'www.wix.com', rel: 'nofollow', target: '_self' },
  expectedData2: { url: 'www.sport5.co.il', rel: 'sponsored', target: '_self' },
};

const mention = {
  type: RICOS_MENTION_TYPE,
  data1: {
    mention: MentionData.fromJSON({ name: 'aviv', slug: 'blabla', id: '1234' }),
    trigger: '@',
  },
  selection1: endOfSelection,
  data2: {
    mention: MentionData.fromJSON({ name: 'chen', slug: 'blibla', id: '5678' }),
    trigger: '@',
  },
  selection2: mentionSelection,
  expectedData1: {
    mention: {
      name: 'aviv',
      slug: 'blabla',
      id: '1234',
    },
  },
  expectedData2: {
    mention: {
      name: 'chen',
      slug: 'blibla',
      id: '5678',
    },
  },
};

const textColor = {
  type: RICOS_TEXT_COLOR_TYPE,
  data1: { color: 'color4' },
  selection1: selection,
  data2: { color: 'color2' },
  selection2: selectionCollapsed,
  expectedData1: 'color4',
  expectedData2: 'color2',
};

const highlightColor = {
  type: RICOS_TEXT_HIGHLIGHT_TYPE,
  data1: { color: 'color3' },
  selection1: selection,
  data2: { color: 'color1' },
  selection2: selectionCollapsed,
  expectedData1: 'color3',
  expectedData2: 'color1',
};

const fontSize = {
  type: RICOS_FONT_SIZE_TYPE,
  data1: { fontSize: 30 },
  selection1: selection,
  data2: { fontSize: 20 },
  selection2: selectionCollapsed,
  expectedData1: '30px',
  expectedData2: '20px',
};

export const inlineStylesTestConfig = ['bold', 'italic', 'underline', 'spoiler'];

export const pluginsTestConfig = {
  divider,
  giphy,
  html,
  gallery,
  // poll,
  // video,
  file,
  image,
};

export const decorationsTestConfig = { link, mention, textColor, highlightColor, fontSize };
