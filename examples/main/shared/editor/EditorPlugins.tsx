/* eslint-disable fp/no-delete */
import React from 'react';
import { createLinkPlugin, LINK_TYPE, pluginLink } from 'wix-rich-content-plugin-link';
import {
  createLinkPreviewPlugin,
  LINK_PREVIEW_TYPE,
  LinkPreviewProviders,
  pluginLinkPreview,
} from 'wix-rich-content-plugin-link-preview';
import {
  createLineSpacingPlugin,
  LINE_SPACING_TYPE,
  pluginLineSpacing,
} from 'wix-rich-content-plugin-line-spacing';
import { createHashtagPlugin, HASHTAG_TYPE, pluginHashtag } from 'wix-rich-content-plugin-hashtag';
import { createEmojiPlugin, EMOJI_TYPE, pluginEmoji } from 'wix-rich-content-plugin-emoji';
import { createImagePlugin, IMAGE_TYPE, pluginImage } from 'wix-rich-content-plugin-image';
import {
  createUndoRedoPlugin,
  pluginUndoRedo,
  UNDO_REDO_TYPE,
} from 'wix-rich-content-plugin-undo-redo';
import { createGalleryPlugin, GALLERY_TYPE, pluginGallery } from 'wix-rich-content-plugin-gallery';
import {
  createVideoPlugin,
  pluginVideo,
  VIDEO_TYPE,
  videoButtonsTypes,
} from 'wix-rich-content-plugin-video';
import {
  createAudioPlugin,
  pluginAudio,
  AUDIO_TYPE,
  audioButtonsTypes,
} from 'wix-rich-content-plugin-audio';
import { createHtmlPlugin, HTML_TYPE, pluginHtml } from 'wix-rich-content-plugin-html';
import { createDividerPlugin, DIVIDER_TYPE, pluginDivider } from 'wix-rich-content-plugin-divider';
import {
  createVerticalEmbedPlugin,
  VERTICAL_EMBED_TYPE,
  verticalEmbedProviders,
  pluginVerticalEmbed,
} from 'wix-rich-content-plugin-vertical-embed';
import {
  createExternalMentionsPlugin,
  EXTERNAL_MENTIONS_TYPE,
  pluginMentions,
} from 'wix-rich-content-plugin-mentions';
import {
  createCodeBlockPlugin,
  CODE_BLOCK_TYPE,
  pluginCodeBlock,
} from 'wix-rich-content-plugin-code-block';
import {
  createHeadingsPlugin,
  HEADINGS_DROPDOWN_TYPE,
  pluginHeadings,
} from 'wix-rich-content-plugin-headings';
import { createGiphyPlugin, GIPHY_TYPE, pluginGiphy } from 'wix-rich-content-plugin-giphy';
import {
  createHeadersMarkdownPlugin,
  HEADERS_MARKDOWN_TYPE,
  pluginHeadersMarkdown,
} from 'wix-rich-content-plugin-headers-markdown';
import { createMapPlugin, MAP_TYPE, pluginMap } from 'wix-rich-content-plugin-map';
import { createPollPlugin, pluginPoll, POLL_TYPE } from 'wix-rich-content-plugin-social-polls';
import {
  createFileUploadPlugin,
  FILE_UPLOAD_TYPE,
  pluginFileUpload,
} from 'wix-rich-content-plugin-file-upload';
import {
  createTextColorPlugin,
  pluginTextColor,
  pluginTextHighlight,
  TEXT_COLOR_TYPE,
  createTextHighlightPlugin,
  TEXT_HIGHLIGHT_TYPE,
} from 'wix-rich-content-plugin-text-color';
import {
  createSpoilerPlugin,
  SPOILER_TYPE,
  SpoilerEditorWrapper,
  pluginSpoiler,
} from 'wix-rich-content-plugin-spoiler';
import {
  createLinkButtonPlugin,
  LINK_BUTTON_TYPE,
  createActionButtonPlugin,
  ACTION_BUTTON_TYPE,
  pluginActionButton,
  pluginLinkButton,
} from 'wix-rich-content-plugin-button';
import Highlighter from 'react-highlight-words';
import casual from 'casual-browserify';
import { mockFetchUrlPreviewData } from '../../../storybook/src/shared/utils/linkPreviewUtil';
import { createIndentPlugin, pluginIndent, INDENT_TYPE } from 'wix-rich-content-plugin-indent';
import { createTablePlugin, pluginTable, TABLE_TYPE } from 'wix-rich-content-plugin-table';
import {
  createCollapsibleListPlugin,
  COLLAPSIBLE_LIST_TYPE,
  pluginCollapsibleList,
} from 'wix-rich-content-plugin-collapsible-list';
import {
  createUnsupportedBlocksPlugin,
  pluginUnsupportedBlocks,
} from 'wix-rich-content-plugin-unsupported-blocks';
import { UNSUPPORTED_BLOCKS_TYPE } from 'wix-rich-content-plugin-commons';

import {
  customForegroundStyleFn,
  styleSelectionPredicate,
  colorScheme,
  customBackgroundStyleFn,
} from '../../src/text-color-style-fn';
// import { MyCustomIcon, SizeSmallRightIcon, TOOLBARS } from 'wix-rich-content-editor-common';
import {
  FORMATTING_BUTTONS,
  TOOLBARS,
  INSERT_PLUGIN_BUTTONS,
} from 'wix-rich-content-editor-common';
// import InlineToolbarDecoration from './Components/InlineToolbarDecoration';
// import StaticToolbarDecoration from './Components/StaticToolbarDecoration';
// import SideToolbarDecoration from './Components/SideToolbarDecoration';
// import PluginToolbarDecoration from './Components/PluginToolbarDecoration';
import {
  MockVerticalSearchModule,
  MockGetIsVisiblePromise,
} from '../../../storybook/src/shared/utils/verticalEmbedUtil';
import {
  mockFileUploadFunc,
  mockFileNativeUploadFunc,
  mockVideoNativeUploadFunc,
  mockCustomVideoUploadFunc,
  mockCustomAudioUploadFunc,
  mockAudioNativeUploadFunc,
  mockImageNativeUploadFunc,
  mockImageUploadFunc,
} from '../../../storybook/src/shared/utils/fileUploadUtil';
import type {
  CreatePluginFunction,
  EditorPluginCreator,
  UISettings,
} from 'wix-rich-content-common';
import type { RichContentEditorProps } from 'wix-rich-content-editor';

export const ricosEditorPlugins: Record<string, EditorPluginCreator<unknown>> = {
  [IMAGE_TYPE]: pluginImage,
  [GALLERY_TYPE]: pluginGallery,
  [VIDEO_TYPE]: pluginVideo,
  [AUDIO_TYPE]: pluginAudio,
  [HTML_TYPE]: pluginHtml,
  [DIVIDER_TYPE]: pluginDivider,
  [LINE_SPACING_TYPE]: pluginLineSpacing,
  [LINK_TYPE]: pluginLink,
  [HASHTAG_TYPE]: pluginHashtag,
  [EXTERNAL_MENTIONS_TYPE]: pluginMentions,
  [CODE_BLOCK_TYPE]: pluginCodeBlock,
  [GIPHY_TYPE]: pluginGiphy,
  [HEADERS_MARKDOWN_TYPE]: pluginHeadersMarkdown,
  [MAP_TYPE]: pluginMap,
  [FILE_UPLOAD_TYPE]: pluginFileUpload,
  [LINK_BUTTON_TYPE]: pluginLinkButton,
  [TEXT_COLOR_TYPE]: pluginTextColor,
  [EMOJI_TYPE]: pluginEmoji,
  [TEXT_HIGHLIGHT_TYPE]: pluginTextHighlight,
  [UNDO_REDO_TYPE]: pluginUndoRedo,
  [UNSUPPORTED_BLOCKS_TYPE]: pluginUnsupportedBlocks,
  [LINK_PREVIEW_TYPE]: pluginLinkPreview,
  [SPOILER_TYPE]: pluginSpoiler,
  [VERTICAL_EMBED_TYPE]: pluginVerticalEmbed,
  [HEADINGS_DROPDOWN_TYPE]: pluginHeadings,
  [INDENT_TYPE]: pluginIndent,
  [ACTION_BUTTON_TYPE]: pluginActionButton,
  [POLL_TYPE]: pluginPoll,
  [COLLAPSIBLE_LIST_TYPE]: pluginCollapsibleList,
  [TABLE_TYPE]: pluginTable,
};

export const editorPluginsPartialPreset: CreatePluginFunction[] = [
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

export const editorPluginsEmbedsPreset: CreatePluginFunction[] = [
  createLinkPlugin,
  createLinkPreviewPlugin,
  createVerticalEmbedPlugin,
];

export const editorPluginsSpoilerPreset: CreatePluginFunction[] = [
  createLinkPlugin,
  createSpoilerPlugin,
];

export const textPlugins: CreatePluginFunction[] = [
  createLinkPreviewPlugin,
  createVerticalEmbedPlugin,
  createIndentPlugin,
  createActionButtonPlugin,
  ...editorPluginsPartialPreset,
];

export const editorPlugins: CreatePluginFunction[] = [
  createLinkPreviewPlugin,
  createSpoilerPlugin,
  createVerticalEmbedPlugin,
  createHeadingsPlugin,
  createIndentPlugin,
  createActionButtonPlugin,
  createPollPlugin,
  createCollapsibleListPlugin,
  createTablePlugin,
  ...editorPluginsPartialPreset,
];

export const editorPluginsMap: Record<string, CreatePluginFunction | CreatePluginFunction[]> = {
  image: createImagePlugin,
  gallery: createGalleryPlugin,
  video: createVideoPlugin,
  audio: createAudioPlugin,
  html: createHtmlPlugin,
  divider: createDividerPlugin,
  spacing: createLineSpacingPlugin,
  link: createLinkPlugin,
  linkPreview: createLinkPreviewPlugin,
  indent: createIndentPlugin,
  hashtag: createHashtagPlugin,
  mentions: createExternalMentionsPlugin,
  codeBlock: createCodeBlockPlugin,
  giphy: createGiphyPlugin,
  headings: createHeadingsPlugin,
  spoiler: createSpoilerPlugin,
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
  polls: createPollPlugin,
  collapsibleList: createCollapsibleListPlugin,
  table: createTablePlugin,
  partialPreset: editorPluginsPartialPreset,
  embedsPreset: editorPluginsEmbedsPreset,
  spoilerPreset: editorPluginsSpoilerPreset,
  textPlugins,
  all: editorPlugins,
  unsupportedBlocks: createUnsupportedBlocksPlugin,
};

const innerRCEPlugins = [
  createTextColorPlugin,
  createTextHighlightPlugin,
  createIndentPlugin,
  createLineSpacingPlugin,
  createLinkPlugin,
  createImagePlugin,
  createVideoPlugin,
  createAudioPlugin,
  createGiphyPlugin,
  createEmojiPlugin,
  createFileUploadPlugin,
  createDividerPlugin,
  createCodeBlockPlugin,
  createUnsupportedBlocksPlugin,
  createSpoilerPlugin,
  createHeadingsPlugin,
];

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
    itemToString: item => item?.value,
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

export const uiSettings: UISettings = {
  linkPanel: {
    externalPopups: false,
    // blankTargetToggleVisibilityFn: () => true, // deprecated
    // nofollowRelToggleVisibilityFn: () => true, // deprecated
    showNewTabCheckbox: true,
    showNoFollowCheckbox: true,
    showSponsoredCheckbox: true,
    dropDown: getLinkPanelDropDownConfig(),
    //placeholder: "Enter a URL here",
  },
  // disableDownload: true,
};

export const videoHandlers = {
  //media manager - Here you can call your custom video upload functionality (comment function to disable custom upload)
  handleFileSelection: mockCustomVideoUploadFunc,
  // this is for native file upload
  handleFileUpload: mockVideoNativeUploadFunc,
};

export const audioHandlers = {
  //media manager - Here you can call your custom video upload functionality (comment function to disable custom upload)
  handleFileSelection: mockCustomAudioUploadFunc,
  // this is for native file upload
  handleFileUpload: mockAudioNativeUploadFunc,
};

export const addPluginMenuConfig = {
  showSearch: true,
  splitToSections: true,
};
const footerToolbarConfig = {
  morePluginsMenu: {
    splitToSections: false,
    showSearch: true,
  },
  // pluginsToDisplayInToolbar: [EMOJI_TYPE, GALLERY_TYPE],
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
export const config: RichContentEditorProps['config'] = {
  [SPOILER_TYPE]: {
    SpoilerEditorWrapper,
    // supportedPlugins: [GALLERY_TYPE, IMAGE_TYPE, VIDEO_TYPE],
  },
  [POLL_TYPE]: {
    showVoteRoleSetting: true,
  },
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
    // accept: 'image/*',
    // defaultData: {
    //   config: {
    //     size: 'small',
    //   },
    // },
    // disableExpand: true,
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
    // disableExpand: true,
    imageEditorWixSettings: {
      initiator: 'some-initiator',
      siteToken:
        // eslint-disable-next-line max-len
        'JWS.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5FUXljQzlOIn0.eyJpYXQiOjE1Njc1MjY3NzQsImRhdGEiOiJ7XCJ1c2VySWRcIjpcIjE5YTY0YTRjLWVlZTAtNGYxNC1iNjI3LTY3MmQ1ZjE2OGJkNFwiLFwibWV0YXNpdGVJZFwiOlwiNTM4ZmE2YzYtYzk1My00Y2RkLTg2YzQtNGI4NjlhZWNmOTgwXCJ9IiwiZXhwIjoxNTY4NzM2Mzc0fQ.n21OxIzSbqi8N3v30b6cIxMdshBnkkf2WQLWEFVXsLk',
      metaSiteId: '538fa6c6-c953-4cdd-86c4-4b869aecf980',
      mediaRoot: 'some-mediaRoot',
    },
    // createGalleryForMultipleImages: true,
    // eslint-disable-next-line no-console
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
  [TABLE_TYPE]: {
    innerRCEPlugins,
  },
  [HASHTAG_TYPE]: {
    createHref: decoratedText => `/search/posts?query=${encodeURIComponent('#')}${decoratedText}`,
    onClick: (event, text) => {
      event.preventDefault();
      // eslint-disable-next-line no-console
      console.log(`'${text}' hashtag clicked!`);
    },
  },
  [HTML_TYPE]: {
    minWidth: 35,
    maxWidth: 740,
    width: 350,
    minHeight: 50,
    maxHeight: 1200,
    exposeButtons: ['html', 'adsense'],
    siteDomain: 'https://www.wix.com',
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
    // eslint-disable-next-line no-console
    // handleDropdownOpen: () => console.log('mentions dropdown opened'),
    // eslint-disable-next-line no-console
    // onMentionClick: mention => console.log({ mention }),
    // eslint-disable-next-line no-console
    // handleDropdownClose: () => console.log('mentions dropdown closed'),
    getMentions: searchQuery =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve(
              [
                {
                  name: 'Oded Soffrin',
                  slug: 'oddedsoffrin',
                  avatar: 'https://ca.slack-edge.com/T02T01M9Y-U0MN7A3H8-38d64543367b-192',
                },
                {
                  name: 'Alex Greenstein',
                  slug: 'alexgreenstein',
                  avatar: 'https://ca.slack-edge.com/T02T01M9Y-U6FQCJ5GT-65d722ddfc28-192',
                },
                { name: 'Yaron Nachshon', slug: 'yaronnachshon' },
                {
                  name: 'Dana Rish',
                  slug: 'danarish',
                  avatar: 'https://ca.slack-edge.com/T02T01M9Y-UEBDPSU2W-ad52085040c0-192',
                },
                {
                  name: 'Judith Gabriela Jaroslavsky',
                  slug: 'judithjaroslavsky',
                  avatar: 'https://ca.slack-edge.com/T02T01M9Y-UHMNZJ9P1-c693bb66ca93-512',
                },
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
    // supportWhitespace: false
  },
  [COLLAPSIBLE_LIST_TYPE]: {
    innerRCEPlugins,
  },
  [HEADINGS_DROPDOWN_TYPE]: {
    customHeadings: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'],
    allowHeadingCustomization: true,
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
    // eslint-disable-next-line no-console
    onUpdate: spacing => console.log(LINE_SPACING_TYPE, spacing),
  },
  [LINK_TYPE]: {
    // toolbar: {
    //   icons: {
    //     InsertPluginButtonIcon: MyCustomIcon,
    //   },
    // },
    // eslint-disable-next-line no-console
    onClick: (event, url) => console.log('link clicked!', url),
    linkTypes: { anchor: true },
    // linkTypes: {
    //   anchor: {
    //     blockPreview: ({ type, data, text }) => {
    //       console.log({ type, data, text });
    //       const blockPreview = { thumbnail: <div>bla1</div>, type: 'bla2', content: 'bla3' };
    //       return blockPreview;
    //     },
    //   },
    // },
    // onLinkAdd: (customLinkData, saveData) => {
    //   const data = { mockURL: 'www.sport5.co.il', mockData: {} };
    //   saveData(data);
    // },
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
    verticalsApi: type => new MockVerticalSearchModule(type),
    exposeEmbedButtons: [product, event, booking],
    getIsVisiblePromise: (type, locale) => MockGetIsVisiblePromise(type, locale),
    // slimLayout: true,
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
    // handleFileSelection: videoHandlers.handleFileSelection,
    // this is for native file upload
    // handleFileUpload: videoHandlers.handleFileUpload,
    enableCustomUploadOnMobile: true,
    // Function is invoked when rendering video which has relative URL.
    // You should take the pathname and form a full URL.
    getVideoUrl: src => `https://video.wixstatic.com/${src.pathname}`,
    exposeButtons: [
      videoButtonsTypes.video,
      videoButtonsTypes.soundCloud,
      videoButtonsTypes.youTube,
    ],
  },
  [AUDIO_TYPE]: {
    //media manager - Here you can call your custom audio upload functionality (comment function to disable custom upload)
    // handleFileSelection: audioHandlers.handleFileSelection,
    // this is for native file upload
    // handleFileUpload: audioHandlers.handleFileUpload,
    // Function is invoked when rendering audio which has relative URL.
    // You should take the pathname and form a full URL.
    getAudioUrl: src => `https://static.wixstatic.com/${src.id}`,
    fetchData: mockFetchUrlPreviewData(),
    exposeButtons: [
      audioButtonsTypes.audio,
      audioButtonsTypes.soundCloud,
      audioButtonsTypes.spotify,
    ],
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
    adobeAPIKey: '77266adc759d4dc2a9e071e3bde25095',
    // onFileSelected: mockFileNativeUploadFunc,
    // handleFileSelection: mockFileUploadFunc,
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
    positionPicker: (buttonRef, panelWidth) => {
      const { bottom, left } = buttonRef.current.getBoundingClientRect();
      const panelLeft = left - panelWidth / 2;
      return { left: panelLeft, top: bottom };
    },
  },
  uiSettings,
  getToolbarSettings: ({ textButtons }) => [
    {
      name: TOOLBARS.INSERT_PLUGIN,
      shouldCreate: () => ({ desktop: true }),
      getButtons: () => {
        const desktopButtons = [
          INSERT_PLUGIN_BUTTONS.POLLS,
          INSERT_PLUGIN_BUTTONS.IMAGE,
          INSERT_PLUGIN_BUTTONS.GALLERY,
          INSERT_PLUGIN_BUTTONS.INSTAGRAM,
          INSERT_PLUGIN_BUTTONS.TWITTER,
          INSERT_PLUGIN_BUTTONS.TIKTOK,
          INSERT_PLUGIN_BUTTONS.VIDEO,
          INSERT_PLUGIN_BUTTONS.YOUTUBE,
          INSERT_PLUGIN_BUTTONS.AUDIO,
          INSERT_PLUGIN_BUTTONS.SOUND_CLOUD,
          INSERT_PLUGIN_BUTTONS.SPOTIFY,
          INSERT_PLUGIN_BUTTONS.HTML,
          INSERT_PLUGIN_BUTTONS.ADSENSE,
          INSERT_PLUGIN_BUTTONS.DIVIDER,
          INSERT_PLUGIN_BUTTONS.CODE_BLOCK,
          INSERT_PLUGIN_BUTTONS.GIF,
          INSERT_PLUGIN_BUTTONS.FILE,
          INSERT_PLUGIN_BUTTONS.BUTTON,
          INSERT_PLUGIN_BUTTONS.EMOJI,
          INSERT_PLUGIN_BUTTONS.STORES,
          INSERT_PLUGIN_BUTTONS.EVENTS,
          INSERT_PLUGIN_BUTTONS.BOOKINGS,
          INSERT_PLUGIN_BUTTONS.COLLAPSIBLE_LIST,
          INSERT_PLUGIN_BUTTONS.TABLE,
        ];

        const mobileButtons = [INSERT_PLUGIN_BUTTONS.BUTTON, INSERT_PLUGIN_BUTTONS.VIDEO];
        return {
          desktop: desktopButtons,
          mobile: {
            android: mobileButtons,
          },
        };
      },
    },
    {
      name: TOOLBARS.FORMATTING,
      shouldCreate: () => ({ desktop: true, mobile: { android: true } }),
      getButtons: () => {
        const desktopButtons = [
          FORMATTING_BUTTONS.HEADINGS,
          '|',
          FORMATTING_BUTTONS.ALIGN_LEFT,
          FORMATTING_BUTTONS.ALIGN_CENTER,
          FORMATTING_BUTTONS.ALIGN_RIGHT,
          FORMATTING_BUTTONS.ALIGN_JUSTIFY,
          FORMATTING_BUTTONS.BOLD,
          FORMATTING_BUTTONS.ITALIC,
          FORMATTING_BUTTONS.UNDERLINE,
          FORMATTING_BUTTONS.TEXT_COLOR,
          FORMATTING_BUTTONS.TEXT_HIGHLIGHT,
          FORMATTING_BUTTONS.TITLE,
          FORMATTING_BUTTONS.BLOCKQUOTE,
          '|',
          // FORMATTING_BUTTONS.ALIGN_GROUP,
          FORMATTING_BUTTONS.ALIGNMENT,
          FORMATTING_BUTTONS.ORDERED_LIST,
          FORMATTING_BUTTONS.UNORDERED_LIST,
          FORMATTING_BUTTONS.DECREASE_INDENT,
          FORMATTING_BUTTONS.INCREASE_INDENT,
          '|',
          FORMATTING_BUTTONS.SPOILER,
          FORMATTING_BUTTONS.LINE_SPACING,
          FORMATTING_BUTTONS.LINK,
          FORMATTING_BUTTONS.CODE_BLOCK,
        ];

        const mobileButtons = [
          FORMATTING_BUTTONS.BOLD,
          FORMATTING_BUTTONS.ITALIC,
          FORMATTING_BUTTONS.UNDERLINE,
          FORMATTING_BUTTONS.TEXT_COLOR,
          FORMATTING_BUTTONS.LINE_SPACING,
        ];
        return {
          desktop: desktopButtons,
          mobile: {
            android: mobileButtons,
          },
        };
      },
      // getButtons: () => {
      //   const desktopButtons = [
      //     FORMATTING_BUTTONS.HEADINGS,
      //     '|',
      //     FORMATTING_BUTTONS.BOLD,
      //     FORMATTING_BUTTONS.ITALIC,
      //     FORMATTING_BUTTONS.UNDERLINE,
      //     FORMATTING_BUTTONS.TEXT_COLOR,
      //     FORMATTING_BUTTONS.TEXT_HIGHLIGHT,
      //     FORMATTING_BUTTONS.TITLE,
      //     FORMATTING_BUTTONS.BLOCKQUOTE,
      //     {
      //       tooltipKey: 'AlignTextDropdownButton_Tooltip',
      //       name: 'Alignment',
      //       dataHook: 'Alignment',
      //       buttons: [
      //         FORMATTING_BUTTONS.ALIGN_LEFT,
      //         FORMATTING_BUTTONS.ALIGN_CENTER,
      //         FORMATTING_BUTTONS.ALIGN_RIGHT,
      //         FORMATTING_BUTTONS.ALIGN_JUSTIFY,
      //       ],
      //     },
      //     {
      //       tooltipKey: 'Lists',
      //       name: 'Lists',
      //       dataHook: 'Lists',
      //       buttons: [FORMATTING_BUTTONS.ORDERED_LIST, FORMATTING_BUTTONS.UNORDERED_LIST],
      //     },
      //     {
      //       tooltipKey: 'Indentation',
      //       name: 'Indentation',
      //       dataHook: 'Indentation',
      //       buttons: [FORMATTING_BUTTONS.DECREASE_INDENT, FORMATTING_BUTTONS.INCREASE_INDENT],
      //     },
      //     '|',
      //     FORMATTING_BUTTONS.LINE_SPACING,
      //     FORMATTING_BUTTONS.LINK,
      //     FORMATTING_BUTTONS.CODE_BLOCK,
      //   ];

      //   const mobileButtons = [
      //     FORMATTING_BUTTONS.BOLD,
      //     FORMATTING_BUTTONS.ITALIC,
      //     FORMATTING_BUTTONS.UNDERLINE,
      //     FORMATTING_BUTTONS.TEXT_COLOR,
      //     FORMATTING_BUTTONS.LINE_SPACING,
      //   ];
      //   return {
      //     desktop: desktopButtons,
      //     mobile: {
      //       android: mobileButtons,
      //     },
      //   };
      // },
    },
    {
      name: TOOLBARS.SIDE,
      addPluginMenuConfig,
      // onClick: () => console.log('plus button clicked!'),
    },
    { name: TOOLBARS.MOBILE, addPluginMenuConfig },
    { name: TOOLBARS.FOOTER, footerToolbarConfig },
    {
      name: TOOLBARS.INLINE,
      getButtons: () => ({
        desktop: [
          FORMATTING_BUTTONS.HEADINGS,
          '|',
          FORMATTING_BUTTONS.FONT_SIZE,
          ...textButtons.desktop.filter(
            b => b !== FORMATTING_BUTTONS.TITLE && b !== FORMATTING_BUTTONS.HEADINGS
          ),
        ],
        mobile: {
          ios: [
            FORMATTING_BUTTONS.HEADINGS,
            '|',
            ...textButtons.mobile.filter(b => b !== FORMATTING_BUTTONS.TITLE),
          ],
          android: [
            FORMATTING_BUTTONS.HEADINGS,
            '|',
            ...textButtons.mobile.filter(b => b !== FORMATTING_BUTTONS.TITLE),
          ],
        },
      }),
      // buttonsOverrides: () => ({
      //   desktop: {
      //     Bold: {
      //       icon: () => <div>bla</div>,
      //       tooltip: 'blabla',
      //     },
      //   },
      //   mobile: {
      //     ios: {},
      //     android: {},
      //   },
      // }),
      // getTextPluginButtons: () => {
      //   return {
      //     desktop: {
      //       MY_BUTTON: {
      //         component: () => (
      //           <div onClick={() => console.log('my button clicked!!')}>My Button</div>
      //         ),
      //       },
      //       Bold: {
      //         component: () => <div onClick={() => console.log('my custom bold')}>My Bold</div>,
      //       },
      //     },
      //   };
      // },
    },
    {
      name: TOOLBARS.STATIC,
      getButtons: () => ({
        desktop: [
          FORMATTING_BUTTONS.HEADINGS,
          '|',
          FORMATTING_BUTTONS.FONT_SIZE,
          ...textButtons.desktop.filter(b => b !== FORMATTING_BUTTONS.HEADINGS),
        ],
      }),
    },
    // {
    //   name: TOOLBARS.STATIC,
    //   getButtons: () => ({
    //     desktop: [
    //       ...(textButtons?.desktop?.filter?.(button => button !== FORMATTING_BUTTONS.CODE_BLOCK) ??
    //         []),
    //       '|',
    //       'FULLSCREEN_TOGGLE',
    //     ],
    //   }),
    //   getTextPluginButtons: () => {
    //     return {
    //       desktop: {
    //         FULLSCREEN_TOGGLE: {
    //           component: () => (
    //             <div onClick={() => console.log('blabla')} data-hook="blabla">
    //               blabla
    //             </div>
    //           ),
    //         },
    //       },
    //     };
    //   },
    // },
  ],
};

export const getConfig = (additionalConfig = {}, shouldNativeUpload = false) => {
  const _config = { ...config };
  Object.keys(additionalConfig).forEach(key => {
    _config[key] = { ...(_config[key] || {}), ...(additionalConfig[key] || {}) };
  });

  return toggleNativeUploadConfig(_config, shouldNativeUpload);
};

export const toggleNativeUploadConfig = (
  currentConfig: RichContentEditorProps['config'],
  shouldNativeUpload: boolean
) => {
  const _config = { ...currentConfig };
  if (shouldNativeUpload) {
    // native upload
    _config[FILE_UPLOAD_TYPE].onFileSelected = mockFileNativeUploadFunc;
    _config[VIDEO_TYPE].handleFileUpload = videoHandlers.handleFileUpload;
    _config[AUDIO_TYPE].handleFileUpload = audioHandlers.handleFileUpload;
    delete _config[FILE_UPLOAD_TYPE].handleFileSelection;
    delete _config[VIDEO_TYPE].handleFileSelection;
    delete _config[AUDIO_TYPE].handleFileSelection;
  } else {
    // media manager
    _config[FILE_UPLOAD_TYPE].handleFileSelection = mockFileUploadFunc;
    _config[VIDEO_TYPE].handleFileSelection = videoHandlers.handleFileSelection;
    _config[AUDIO_TYPE].handleFileSelection = audioHandlers.handleFileSelection;
    delete _config[FILE_UPLOAD_TYPE].onFileSelected;
    delete _config[VIDEO_TYPE].handleFileUpload;
    delete _config[AUDIO_TYPE].handleFileUpload;
  }
  return _config;
};
