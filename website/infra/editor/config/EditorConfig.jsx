import React from 'react';
import { createLinkPlugin, LINK_TYPE } from 'wix-rich-content-plugin-link';
import {
  createLinkPreviewPlugin,
  LINK_PREVIEW_TYPE,
  LinkPreviewProviders,
} from 'wix-rich-content-plugin-link-preview';
import { createLineSpacingPlugin, LINE_SPACING_TYPE } from 'wix-rich-content-plugin-line-spacing';
import { createHashtagPlugin, HASHTAG_TYPE } from 'wix-rich-content-plugin-hashtag';
import { createEmojiPlugin, EMOJI_TYPE } from 'wix-rich-content-plugin-emoji';
import { createImagePlugin, IMAGE_TYPE } from 'wix-rich-content-plugin-image';
import { createUndoRedoPlugin, UNDO_REDO_TYPE } from 'wix-rich-content-plugin-undo-redo';
import { createGalleryPlugin, GALLERY_TYPE } from 'wix-rich-content-plugin-gallery';
import { createVideoPlugin, VIDEO_TYPE } from 'wix-rich-content-plugin-video';
import { createAudioPlugin, AUDIO_TYPE } from 'wix-rich-content-plugin-audio';
import { createHtmlPlugin, HTML_TYPE } from 'wix-rich-content-plugin-html';
import { createDividerPlugin, DIVIDER_TYPE } from 'wix-rich-content-plugin-divider';
import { createUnsupportedBlocksPlugin } from 'wix-rich-content-plugin-unsupported-blocks';
import { UNSUPPORTED_BLOCKS_TYPE } from 'wix-rich-content-plugin-commons';
import {
  createVerticalEmbedPlugin,
  VERTICAL_EMBED_TYPE,
  verticalEmbedProviders,
} from 'wix-rich-content-plugin-vertical-embed';
import {
  createExternalMentionsPlugin,
  EXTERNAL_MENTIONS_TYPE,
} from 'wix-rich-content-plugin-mentions';
import { createCodeBlockPlugin, CODE_BLOCK_TYPE } from 'wix-rich-content-plugin-code-block';
import { createGiphyPlugin, GIPHY_TYPE } from 'wix-rich-content-plugin-giphy';
import {
  createHeadersMarkdownPlugin,
  HEADERS_MARKDOWN_TYPE,
} from 'wix-rich-content-plugin-headers-markdown';
import { createMapPlugin, MAP_TYPE } from 'wix-rich-content-plugin-map';
import { createFileUploadPlugin, FILE_UPLOAD_TYPE } from 'wix-rich-content-plugin-file-upload';
import {
  createTextHighlightPlugin,
  TEXT_HIGHLIGHT_TYPE,
  createTextColorPlugin,
  TEXT_COLOR_TYPE,
} from 'wix-rich-content-plugin-text-color';
import {
  createLinkButtonPlugin,
  LINK_BUTTON_TYPE,
  createActionButtonPlugin,
  ACTION_BUTTON_TYPE,
} from 'wix-rich-content-plugin-button';
import Highlighter from 'react-highlight-words';
import casual from 'casual-browserify';
import { mockFetchUrlPreviewData } from './linkPreviewUtil';

import {
  customForegroundStyleFn,
  styleSelectionPredicate,
  colorScheme,
  customBackgroundStyleFn,
} from './text-color-style-fn';

import { testWixVideos } from './mock';
import { mockAudioData } from './mockAudioData';
// import { MyCustomIcon, SizeSmallRightIcon, TOOLBARS } from 'wix-rich-content-editor-common';
import { TOOLBARS, BUTTONS, DISPLAY_MODE } from 'wix-rich-content-editor-common';
// import InlineToolbarDecoration from './Components/InlineToolbarDecoration';
// import StaticToolbarDecoration from './Components/StaticToolbarDecoration';
// import SideToolbarDecoration from './Components/SideToolbarDecoration';
// import PluginToolbarDecoration from './Components/PluginToolbarDecoration';
import { mockFetchVerticalEmbedFunc } from './verticalEmbedUtil';

export const editorPluginsPartialPreset = [
  createImagePlugin,
  createGalleryPlugin,
  createVideoPlugin,
  createAudioPlugin,
  createHtmlPlugin,
  createDividerPlugin,
  createLineSpacingPlugin,
  createLinkPlugin,
  createHashtagPlugin,
  createExternalMentionsPlugin,
  createCodeBlockPlugin,
  createGiphyPlugin,
  createHeadersMarkdownPlugin,
  createMapPlugin,
  createFileUploadPlugin,
  createLinkButtonPlugin,
  createTextColorPlugin,
  createEmojiPlugin,
  createTextHighlightPlugin,
  createUndoRedoPlugin,
  createUnsupportedBlocksPlugin,
];

export const editorPluginsEmbedsPreset = [
  createLinkPlugin,
  createLinkPreviewPlugin,
  createVerticalEmbedPlugin,
];

export const editorPlugins = [
  createLinkPreviewPlugin,
  createVerticalEmbedPlugin,
  createActionButtonPlugin,
  createUnsupportedBlocksPlugin,
  ...editorPluginsPartialPreset,
];

export const editorPluginsMap = {
  image: createImagePlugin,
  gallery: createGalleryPlugin,
  video: createVideoPlugin,
  audio: createAudioPlugin,
  html: createHtmlPlugin,
  divider: createDividerPlugin,
  spacing: createLineSpacingPlugin,
  link: createLinkPlugin,
  linkPreview: createLinkPreviewPlugin,
  hashtag: createHashtagPlugin,
  mentions: createExternalMentionsPlugin,
  codeBlock: createCodeBlockPlugin,
  giphy: createGiphyPlugin,
  headers: createHeadersMarkdownPlugin,
  map: createMapPlugin,
  fileUpload: createFileUploadPlugin,
  linkButton: createLinkButtonPlugin,
  actionButton: createActionButtonPlugin,
  textColor: createTextColorPlugin,
  emoji: createEmojiPlugin,
  highlight: createTextHighlightPlugin,
  undoRedo: createUndoRedoPlugin,
  verticalEmbed: createVerticalEmbedPlugin,
  partialPreset: editorPluginsPartialPreset,
  embedsPreset: editorPluginsEmbedsPreset,
  all: editorPlugins,
  unsupportedBlocks: createUnsupportedBlocksPlugin,
};

const buttonDefaultPalette = ['#FEFDFD', '#D5D4D4', '#ABCAFF', '#81B0FF', '#0261FF', '#0141AA'];
let userButtonTextColors = [...buttonDefaultPalette];
let userButtonBackgroundColors = [...buttonDefaultPalette];
let userButtonBorderColors = [...buttonDefaultPalette];

const getLinkPanelDropDownConfig = () => {
  const getItems = () => {
    casual.define('item', () => {
      return {
        value: casual.url,
        label: casual.catch_phrase,
        date: casual.date('DD/MM/YY'),
      };
    });

    const items = [];
    const amount = 1000;
    for (let i = 0; i < amount; ++i) {
      items.push(casual.item);
    }
    return items;
  };

  const wordHighlighter = (textToHighlight, searchWords) => (
    <Highlighter
      searchWords={[searchWords]}
      textToHighlight={textToHighlight}
      highlightTag={({ children }) => <strong className="highlighted-text">{children}</strong>}
      autoEscape
    />
  );

  const items = getItems();

  return {
    // isOpen: true,
    getItems: () => items,
    itemHeight: 40,
    itemToString: item => item.value,
    formatMenuItem: (item, input) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            paddingRight: '10px',
          }}
        >
          {wordHighlighter(item.label, input)}
        </span>
        <span>{item.date}</span>
      </div>
    ),
  };
};

let userColors = [];

const uiSettings = {
  linkPanel: {
    blankTargetToggleVisibilityFn: () => true,
    nofollowRelToggleVisibilityFn: () => true,
    dropDown: getLinkPanelDropDownConfig(),
    //placeholder: "Enter a URL here",
  },
  // disableRightClick: true,
};

const videoHandlers = {
  //media manager - Here you can call your custom video upload functionality (comment function to disable custom upload)
  handleFileSelection: (updateEntity, removeEntity) => {
    console.log('consumer wants to upload custom video');
    const videoWithAbsoluteUrl = {
      url: 'https://video.wixstatic.com/video/11062b_a552731f40854d16a91627687fb8d1a6/1080p/mp4/file.mp4',
    };
    const videoWithRelativeUrl = {
      pathname: `video/11062b_a552731f40854d16a91627687fb8d1a6/1080p/mp4/file.mp4`,
      thumbnail: {
        pathname: `media/11062b_a552731f40854d16a91627687fb8d1a6f000.jpg`,
        height: 1080,
        width: 1920,
      },
    };
    // You can provide either absolute or relative URL.
    // If relative URL is provided, a function 'getVideoUrl' will be invoked to form a full URL.
    const videoToUpload = videoWithRelativeUrl;
    setTimeout(() => {
      updateEntity({ data: videoToUpload });
      console.log('consumer uploaded ', videoToUpload);
    }, 500);
  },
  // this is for native file upload
  handleFileUpload: (file, updateEntity, removeEntity) => {
    console.log('consumer wants to upload custom video', file);
    const mockVideoIndex = Math.floor(Math.random() * testWixVideos.length);
    const testVideo = testWixVideos[mockVideoIndex];
    const videoWithAbsoluteUrl = {
      url: 'https://video.wixstatic.com/video/11062b_a552731f40854d16a91627687fb8d1a6/1080p/mp4/file.mp4',
    };
    const videoWithRelativeUrl = {
      pathname: `video/${testVideo.url}/1080p/mp4/file.mp4`,
      thumbnail: {
        pathname: `media/${testVideo.metadata.posters[0].url}`,
        height: 1080,
        width: 1920,
      },
    };
    // You can provide either absolute or relative URL.
    // If relative URL is provided, a function 'getVideoUrl' will be invoked to form a full URL.
    const videoToUpload = videoWithRelativeUrl;
    setTimeout(() => {
      updateEntity({ data: videoToUpload /*, error: { msg: 'upload failed' }*/ });
      console.log('consumer uploaded ', videoToUpload);
    }, 2000);
  },
};

const audioHandlers = {
  //media manager - Here you can call your custom audio upload functionality (comment function to disable custom upload)
  handleFileSelection: (updateEntity, removeEntity) => {
    console.log('consumer wants to upload custom audio');
    const audioWithAbsoluteUrl = {
      url: 'https://static.wixstatic.com/mp3/f0f74f_43f712be42dc4377a075dcad3c358a80.mp3',
    };
    const audioWithRelativeUrl = {
      audio: { src: { id: `mp3/f0f74f_43f712be42dc4377a075dcad3c358a80.mp3` } },
      name: 'Dear Fear',
      authorName: 'KOTA The Friend',
    };
    // You can provide either absolute or relative URL.
    // If relative URL is provided, a function 'getAudioUrl' will be invoked to form a full URL.
    const audioToUpload = audioWithRelativeUrl;
    setTimeout(() => {
      updateEntity({ data: audioToUpload });
      console.log('consumer uploaded ', audioToUpload);
    }, 500);
  },
  // this is for native file upload
  handleFileUpload: (file, updateEntity, removeEntity) => {
    console.log('consumer wants to upload custom Audio', file);
    const mockAudioIndex = Math.floor(Math.random() * mockAudioData.length);
    const testAudio = mockAudioData[mockAudioIndex];
    const audioWithAbsoluteUrl = {
      url: 'https://static.wixstatic.com/mp3/f0f74f_43f712be42dc4377a075dcad3c358a80.mp3',
    };
    const audioWithRelativeUrl = {
      audio: { src: { id: `mp3/${testAudio.url}.mp3` } },
      name: 'Dear Fear',
      authorName: 'KOTA The Friend',
    };
    // You can provide either absolute or relative URL.
    // If relative URL is provided, a function 'getVideoUrl' will be invoked to form a full URL.
    const audioToUpload = audioWithRelativeUrl;
    setTimeout(() => {
      updateEntity({ data: audioToUpload /*, error: { msg: 'upload failed' }*/ });
      console.log('consumer uploaded ', audioToUpload);
    }, 2000);
  },
};

const { event, booking, product } = verticalEmbedProviders;
const buttonConfig = {
  // toolbar: {
  //   icons: {
  //     InsertPluginButtonIcon: MyCustomIcon,
  //   },
  // },
  // insertButtonTooltip: 'Custom tooltip',
  palette: ['#FEFDFD', '#D5D4D4', '#ABCAFF', '#81B0FF', '#0261FF', '#0141AA'],
  selectionBackgroundColor: 'fuchsia',
  selectionBorderColor: '#FFF',
  selectionTextColor: '#FFF',
  colors: {
    color1: '#FEFDFD',
    color2: '#D5D4D4',
    color3: '#000000',
    color4: '#000000',
    color5: '#000000',
    color6: '#ABCAFF',
    color7: '#81B0FF',
    color8: '#0261FF',
    color9: '#0141AA',
    color10: '#012055',
  },
  onTextColorAdded: color => (userButtonTextColors = [color, ...userButtonTextColors]),
  onBackgroundColorAdded: color =>
    (userButtonBackgroundColors = [color, ...userButtonBackgroundColors]),
  onBorderColorAdded: color => (userButtonBorderColors = [color, ...userButtonBorderColors]),
  getTextColors: () => userButtonTextColors,
  getBorderColors: () => userButtonBorderColors,
  getBackgroundColors: () => userButtonBackgroundColors,
};
const { Instagram, Twitter, TikTok } = LinkPreviewProviders;
const config = {
  [LINK_PREVIEW_TYPE]: {
    enableEmbed: true, // [Twitter, TikTok]
    enableLinkPreview: true,
    fetchData: mockFetchUrlPreviewData(),
    exposeEmbedButtons: [Instagram, Twitter, TikTok],
  },
  [EMOJI_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
  },
  [UNDO_REDO_TYPE]: {
    // toolbar: {
    //   icons: {
    //     Undo: MyCustomIcon, // insert plugin icon
    //     Redo: MyCustomIcon, // insert plugin icon
    //   },
    // },
  },
  [GALLERY_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
  },
  [IMAGE_TYPE]: {
    // defaultData: {
    //   config: {
    //     alignment: 'left',
    //     size: 'content',
    //     showTitle: true,
    //     showDescription: true,
    //   },
    // },
    imageEditorWixSettings: {
      initiator: 'some-initiator',
      siteToken:
        'JWS.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5FUXljQzlOIn0.eyJpYXQiOjE1Njc1MjY3NzQsImRhdGEiOiJ7XCJ1c2VySWRcIjpcIjE5YTY0YTRjLWVlZTAtNGYxNC1iNjI3LTY3MmQ1ZjE2OGJkNFwiLFwibWV0YXNpdGVJZFwiOlwiNTM4ZmE2YzYtYzk1My00Y2RkLTg2YzQtNGI4NjlhZWNmOTgwXCJ9IiwiZXhwIjoxNTY4NzM2Mzc0fQ.n21OxIzSbqi8N3v30b6cIxMdshBnkkf2WQLWEFVXsLk',
      metaSiteId: '538fa6c6-c953-4cdd-86c4-4b869aecf980',
      mediaRoot: 'some-mediaRoot',
    },
    // createGalleryForMultipleImages: true,
    onImageEditorOpen: () => console.log('Media Studio Launched'),
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //     alignLeft: MyCustomIcon,
    //     link: MyCustomIcon,
    //     sizeOriginal: MyCustomIcon,
    //     sizeSmallCenter: MyCustomIcon,
    //     sizeContent: MyCustomIcon,
    //     imageEditor: MyCustomIcon,
    //     sizeFullWidth: MyCustomIcon,
    //     alignCenter: MyCustomIcon,
    //     alignRight: MyCustomIcon,
    //     settings: MyCustomIcon,
    //     replace: MyCustomIcon,
    //     delete: SizeSmallRightIcon,
    //   },
    // },
    // },
  },
  [HASHTAG_TYPE]: {
    createHref: decoratedText => `/search/posts?query=${encodeURIComponent('#')}${decoratedText}`,
    onClick: (event, text) => {
      event.preventDefault();
      console.log(`'${text}' hashtag clicked!`);
    },
  },
  [HTML_TYPE]: {
    minWidth: 35,
    maxWidth: 740,
    width: 350,
    minHeight: 50,
    maxHeight: 1200,
    // siteDomain="https://www.wix.com"
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
  },
  [EXTERNAL_MENTIONS_TYPE]: {
    repositionSuggestions: true,
    visibleItemsBeforeOverflow: 5,
    popoverComponent: <div />,
    handleDropdownOpen: () => console.log('mentions dropdown opened'),
    onMentionClick: mention => console.log({ mention }),
    handleDropdownClose: () => console.log('mentions dropdown closed'),
    getMentions: searchQuery =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve(
              [
                { name: 'Test One', slug: 'testone' },
                { name: 'Test One.1', slug: 'testone1' },
                { name: 'Test One.2', slug: 'testone2' },
                { name: 'Test One.3', slug: 'testone3' },
                { name: 'Test One.4', slug: 'testone4' },
                { name: 'Test One.5', slug: 'testone5' },
                { name: 'Test One.6', slug: 'testone6' },
                { name: 'Test One.7', slug: 'testone7' },
                { name: 'Test One.8', slug: 'testone8' },
                {
                  name: 'Test Two',
                  slug: 'testwo',
                  avatar: 'https://via.placeholder.com/100x100?text=Image=50',
                },
              ].filter(({ name }) => name.toLowerCase().includes(searchQuery.toLowerCase()))
            ),
          250
        )
      ),
  },
  [LINE_SPACING_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
    defaultSpacing: {
      'line-height': '1.5',
      'padding-top': '2px',
      'padding-bottom': '3px',
    },
    onUpdate: spacing => console.log(LINE_SPACING_TYPE, spacing),
  },
  [LINK_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
    onClick: (event, url) => console.log('link clicked!', url),
  },
  [CODE_BLOCK_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
  },
  [DIVIDER_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
  },
  [UNSUPPORTED_BLOCKS_TYPE]: {},
  [VERTICAL_EMBED_TYPE]: {
    fetchFunctions: {
      [product]: mockFetchVerticalEmbedFunc(product),
      [event]: mockFetchVerticalEmbedFunc(event),
      [booking]: mockFetchVerticalEmbedFunc(booking),
    },
    // exposeEmbedButtons: [product, event, booking],
    exposeEmbedButtons: [product],
  },
  // [EXTERNAL_EMOJI_TYPE]: {},
  [VIDEO_TYPE]: {
    toolbar: {
      hidden: [],
      // icons: {
      //   InsertPluginButtonIcon: MyCustomIcon,
      // },
    },
    //media manager - Here you can call your custom video upload functionality (comment function to disable custom upload)
    handleFileSelection: videoHandlers.handleFileSelection,
    // this is for native file upload
    // handleFileUpload: videoHandlers.handleFileUpload,
    enableCustomUploadOnMobile: true,
    // Function is invoked when rendering video which has relative URL.
    // You should take the pathname and form a full URL.
    getVideoUrl: src => `https://video.wixstatic.com/${src.pathname}`,
  },
  [AUDIO_TYPE]: {
    toolbar: {
      hidden: [],
      // icons: {
      //   InsertPluginButtonIcon: MyCustomIcon,
      // },
    },
    //media manager - Here you can call your custom video upload functionality (comment function to disable custom upload)
    handleFileSelection: audioHandlers.handleFileSelection,
    fetchData: mockFetchUrlPreviewData(),
    // this is for native file upload
    // handleFileUpload: audioHandlers.handleFileUpload,
    // Function is invoked when rendering video which has relative URL.
    // You should take the pathname and form a full URL.
    getAudioUrl: src => `https://static.wixstatic.com/${src.id}`,
  },
  [GIPHY_TYPE]: {
    giphySdkApiKey: process.env.GIPHY_API_KEY || 'HXSsAGVNzjeUjhKfhhD9noF8sIbpYDsV',
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
    sizes: { desktop: 'original', mobile: 'original' }, // original or downsizedSmall are supported
  },
  [MAP_TYPE]: {
    googleMapApiKey: process.env.GOOGLE_MAPS_API_KEY,
    minWidth: 100,
    maxWidth: 740,
    minHeight: 100,
    maxHeight: 1000,
    mapSettings: {
      address: 'Wix HQ, Nemal Tel Aviv Street, Tel Aviv-Yafo, Israel',
      locationDisplayName: 'Wix HQ, Nemal Tel Aviv Street, Tel Aviv-Yafo, Israel',
      lat: 32.097235,
      lng: 34.77427,
      zoom: 18,
      mode: 'roadmap',
      isMarkerShown: true,
      isZoomControlShown: true,
      isStreetViewControlShown: true,
      isDraggingAllowed: true,
    },
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
  },
  [FILE_UPLOAD_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
    accept: '*',
    // onFileSelected: (file, updateEntity) => {
    //   const name = file.name;
    //   const filenameParts = name.split('.');
    //   const type = filenameParts[filenameParts.length - 1];

    //   const data = {
    //     name,
    //     type,
    //     url: '',
    //   };
    //   setTimeout(() => updateEntity({ data }), 1000);
    // },
    handleFileSelection: updateEntity => {
      const filenames = ['image.jpg', 'document.pdf', 'music.mp3'];
      const multiple = false;
      const count = multiple ? [1, 2, 3] : [1];
      const data = [];
      count.forEach(_ => {
        const name = filenames[Math.floor(Math.random() * filenames.length)];
        const filenameParts = name.split('.');
        const type = filenameParts[filenameParts.length - 1];
        data.push({
          name,
          type,
          url: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        });
      });
      setTimeout(() => updateEntity({ data }), 500);
    },
  },
  [LINK_BUTTON_TYPE]: { ...buttonConfig },
  [ACTION_BUTTON_TYPE]: {
    insertButtonTooltip: 'Add an action button',
    ...buttonConfig,
  },
  [TEXT_HIGHLIGHT_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
    colorScheme,
    styleSelectionPredicate,
    customStyleFn: customBackgroundStyleFn,
    onColorAdded: color => (userColors = [...userColors, color]),
    getUserColors: () => userColors,
  },
  [TEXT_COLOR_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
    colorScheme,
    styleSelectionPredicate,
    customStyleFn: customForegroundStyleFn,
    onColorAdded: color => (userColors = [...userColors, color]),
    getUserColors: () => userColors,
  },
  uiSettings,
  getToolbarSettings: ({ pluginButtons, textButtons }) => [
    // {
    //   name: TOOLBARS.TEXT,
    //   getIcons: () => ({
    //     Bold: MyCustomIcon,
    //     Italic: MyCustomIcon,
    //     Underline: MyCustomIcon,
    //     Indent: MyCustomIcon,
    //     inactiveIconTitle: SizeSmallRightIcon,
    //     TitleOne: MyCustomIcon,
    //     TitleTwo: SizeSmallRightIcon,
    //     Blockquote: MyCustomIcon,
    //     Alignment: MyCustomIcon,
    //     AlignLeft: MyCustomIcon,
    //     AlignCenter: MyCustomIcon,
    //     AlignRight: MyCustomIcon,
    //     AlignJustify: MyCustomIcon,
    //     OrderedList: MyCustomIcon,
    //     UnorderedList: MyCustomIcon,
    //   }),
    // },
    // {
    //   name: TOOLBARS.PLUGIN,
    //   getVisibilityFn: () => ({
    //     desktop: () => true,
    //     mobile: {
    //       ios: () => true,
    //       android: () => true
    //     }
    //   }),
    //   getPositionOffset: () => ({
    //     desktop: { x: 850, y: 20 },
    //     mobile: {
    //       ios: { x: 100, y: -100 },
    //       android: { x: -100, y: -100 }
    //     }
    //   }),
    //   getDisplayOptions: () => ({
    //     desktop: { displayMode:  DISPLAY_MODE.FLOATING },
    //   }),
    //   getButtons: () => {
    //     const buttons = pluginButtons.filter(({ type }) => type !== BUTTONS.DELETE);
    //     return {
    //       desktop: buttons,
    //       mobile: {
    //         ios: buttons,
    //         android: buttons
    //       }
    //     };
    //   },
    //   getToolbarDecorationFn: () => ({
    //     desktop: () => PluginToolbarDecoration
    //   })
    // },
    // {
    //   name: TOOLBARS.SIDE,
    //   getDisplayOptions: () => ({
    //     desktop: { displayMode:  DISPLAY_MODE.FLOATING },
    //   }),
    //   getPositionOffset: () => ({
    //     desktop: { x: 1000, y: 780 },
    //     mobile: {
    //       ios: { x: 0, y: 0 },
    //       android: { x: 0, y: 0 },
    //     }
    //   }),
    //   getToolbarDecorationFn: () => ({
    //     desktop: () => SideToolbarDecoration
    //   })
    // },
    // {
    //   name: TOOLBARS.MOBILE,
    //   getDisplayOptions: () => ({
    //     mobile: {
    //       ios: { displayMode:  DISPLAY_MODE.FLOATING },
    //       android: { displayMode:  DISPLAY_MODE.FLOATING },
    //     }
    //   }),
    //   getPositionOffset: () => ({
    //     desktop: { x: 850, y: 50 },
    //     mobile: {
    //       ios: { x: 0, y: 0 },
    //       android: { x: 0, y: 0 },
    //     }
    //   })
    // },
    // {
    //   name: TOOLBARS.FOOTER,
    //   getPositionOffset: () => ({
    //     desktop: { x: 0, y: 700 },
    //     mobile: {
    //       ios: { x: 0, y: 500 },
    //     }
    //   }),
    //   getVisibilityFn: () => ({
    //     desktop: () => true,
    //     mobile: {
    //       ios: () => true,
    //       android: () => true,
    //     }
    //   }),
    //   getDisplayOptions: () => ({
    //     desktop: { displayMode:  DISPLAY_MODE.FLOATING },
    //   }),
    //   getButtons: () => ({
    //     desktop: () => [],
    //     mobile: {
    //       ios: pluginButtons.filter(({ buttonSettings }) => buttonSettings.toolbars.includes(TOOLBARS.FOOTER))
    //       .map(({ component }) => component),
    //       android: () => [],
    //     }
    //   }),
    // },
    // {
    //   name: TOOLBARS.STATIC,
    //   getVisibilityFn: () => ({
    //     desktop: () => true,
    //   }),
    //   getDisplayOptions: () => ({
    //     desktop: { displayMode: DISPLAY_MODE.FLOATING },
    //   }),
    //   getPositionOffset: () => ({
    //     desktop: { x: 300, y: 0 },
    //   }),
    //   // getToolbarDecorationFn: () => ({
    //   //   desktop: () => StaticToolbarDecoration,
    //   // }),
    // },
    // {
    //   name: TOOLBARS.INLINE,
    //   getToolbarDecorationFn: () => ({
    //     desktop: () => InlineToolbarDecoration
    //   })
    // }
  ],
};

export const getConfig = (additionalConfig = {}) => {
  const _config = { ...config };
  Object.keys(additionalConfig).forEach(key => {
    _config[key] = { ...(_config[key] || {}), ...(additionalConfig[key] || {}) };
  });

  return _config;
};
