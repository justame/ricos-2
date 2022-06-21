import { TiptapContentResolver } from '../ContentResolver';
import { RESOLVERS_IDS } from './resolvers-ids';
import { Node_Type, Decoration_Type } from 'ricos-schema';

export const alwaysVisibleResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.ALWAYS_VISIBLE,
  () => {
    return true;
  }
);

export const isTextInSelection = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_IN_SELECTION,
  (content = []) => {
    return content.some(node => node.type.name === 'text');
  }
);

export const isTextContainsBoldResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_BOLD,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      return node?.marks.some(mark => mark.type.name === Decoration_Type.BOLD);
    }
    return false;
  }
);

export const isTextContainsItalicResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_ITALIC,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      return node?.marks.some(mark => mark.type.name === Decoration_Type.ITALIC);
    }
    return false;
  }
);

export const isTextContainsUnderlineResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_UNDERLINE,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      return node?.marks.some(mark => mark.type.name === Decoration_Type.UNDERLINE);
    }
    return false;
  }
);

export const isTextContainsQuoteResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_QUOTE,
  content => {
    return (
      Array.isArray(content) && content.length > 0 && content[0].type.name === Node_Type.BLOCKQUOTE
    );
  }
);

export const isTextContainsCodeblockResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_CODE_BLOCK,
  content => {
    return (
      Array.isArray(content) && content.length > 0 && content[0].type.name === Node_Type.CODE_BLOCK
    );
  }
);

export const isTextContainsOrderedListResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_ORDERED_LIST,
  content => {
    return (
      Array.isArray(content) &&
      content.length > 0 &&
      content[0].type.name === Node_Type.ORDERED_LIST
    );
  }
);

export const isTextContainsUnorderedListResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_UNORDERED_LIST,
  content => {
    return (
      Array.isArray(content) &&
      content.length > 0 &&
      content[0].type.name === Node_Type.BULLETED_LIST
    );
  }
);

export const isTextContainsSpoilerResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_SPOILER,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      return node?.marks.some(mark => mark.type.name === Decoration_Type.SPOILER);
    }
    return false;
  }
);

export const getAlignmentInSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_ALIGNMENT_IN_SELECTION,
  content => {
    if (Array.isArray(content) && content.length > 0) {
      const textAlignment = content[0].attrs.textStyle?.textAlignment;
      if (!textAlignment || textAlignment === 'AUTO') return undefined;
      return textAlignment.toLowerCase();
    } else {
      return undefined;
    }
  }
);

export const getHeadingInSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_HEADING_IN_SELECTION,
  content => {
    if (Array.isArray(content) && content.length > 0) {
      const headingLevel = content[0].attrs?.level;
      if (!headingLevel) return 'unstyled';
      const headingMap = {
        1: 'header-one',
        2: 'header-two',
        3: 'header-three',
        4: 'header-four',
        5: 'header-five',
        6: 'header-six',
      };
      return headingMap[headingLevel];
    } else {
      return undefined;
    }
  }
);

export const getLineSpacingInSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_LINE_SPACING_IN_SELECTION,
  content => {
    if (Array.isArray(content) && content.length > 0) {
      const lineHeight = content[0].attrs.textStyle?.lineHeight;
      if (!lineHeight) return undefined;
      return `${lineHeight}`;
    } else {
      return undefined;
    }
  }
);

export const getLineSpacingBeforeSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_LINE_SPACING_BEFORE_SELECTION,
  content => {
    if (Array.isArray(content) && content.length > 0) {
      const paddingTop = content[0].attrs.style?.paddingTop;
      if (!paddingTop) return undefined;
      return paddingTop;
    } else {
      return undefined;
    }
  }
);

export const getLineSpacingAfterSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_LINE_SPACING_AFTER_SELECTION,
  content => {
    if (Array.isArray(content) && content.length > 0) {
      const paddingBottom = content[0].attrs.style?.paddingBottom;
      if (!paddingBottom) return undefined;
      return paddingBottom;
    } else {
      return undefined;
    }
  }
);

export const getFontSizeInSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_FONT_SIZE_IN_SELECTION,
  content => {
    if (Array.isArray(content)) {
      let returnedFontSize = '';
      let currentFontSize = '';

      // eslint-disable-next-line fp/no-loops
      for (let i = 0; i < content.length; i++) {
        const node = content[i];

        if (node.type.name === 'text') {
          if (
            node.marks.length === 0 ||
            !node?.marks.some(mark => mark.type.name === Decoration_Type.FONT_SIZE)
          ) {
            //TODO: take font size from documentStyle
            currentFontSize = '16';
          } else {
            const fontSizeMark = node?.marks.find(
              mark => mark.type.name === Decoration_Type.FONT_SIZE
            );
            currentFontSize = `${fontSizeMark?.attrs.value}`;
          }
          if (returnedFontSize !== '' && returnedFontSize !== currentFontSize) return '';
          returnedFontSize = currentFontSize;
        }
      }
      return returnedFontSize;
    }
  }
);

export const isTextContainsLinkOrAnchorResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_LINK_OR_ANCHOR,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      return node?.marks.some(
        mark => mark.type.name === Decoration_Type.LINK || mark.type.name === Decoration_Type.ANCHOR
      );
    }
    return false;
  }
);

export const isTextContainsLinkResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_LINK,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      return node?.marks.some(mark => mark.type.name === Decoration_Type.LINK);
    }
    return false;
  }
);

export const isTextContainsAnchorResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_TEXT_CONTAINS_ANCHOR,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      return node?.marks.some(mark => mark.type.name === Decoration_Type.ANCHOR);
    }
    return false;
  }
);

export const getTextColorInSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_TEXT_COLOR_IN_SELECTION,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      const colorMark = node?.marks.find(mark => mark.type.name === Decoration_Type.COLOR);
      return colorMark?.attrs.foreground;
    }
    return false;
  }
);

export const getHighlightColorInSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_HIGHLIGHT_COLOR_IN_SELECTION,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      const colorMark = node?.marks.find(mark => mark.type.name === Decoration_Type.COLOR);
      return colorMark?.attrs.background;
    }
    return false;
  }
);
export const isOnlyTextSelected = TiptapContentResolver.create('yaronResolverExample', content => {
  if (Array.isArray(content)) {
    const noneTextNode = content.find(
      node =>
        node.type.name !== Node_Type.PARAGRAPH &&
        node.type.name !== Node_Type.HEADING &&
        node.type.name !== 'text'
    );
    if (noneTextNode) {
      return false;
    } else {
      return true;
    }
  }
  return false;
});

export const isNodeContainsLinkOrAnchorResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_NODE_CONTAINS_LINK_OR_ANCHOR,
  content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0].attrs.link;
    } else {
      return undefined;
    }
  }
);

const getPluginSelectedResolver = (resolverId: string, tiptapPluginName: string) =>
  TiptapContentResolver.create(
    resolverId,
    content => content.length === 1 && content[0].type.name === tiptapPluginName
  );

export const isImageSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_IMAGE_SELECTED,
  Node_Type.IMAGE
);

export const isVideoSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_VIDEO_SELECTED,
  Node_Type.VIDEO
);

export const isGallerySelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_GALLERY_SELECTED,
  Node_Type.GALLERY
);

export const isFileSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_FILE_SELECTED,
  Node_Type.FILE
);

export const isAudioSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_AUDIO_SELECTED,
  Node_Type.AUDIO
);

export const isHtmlEmbedSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_HTML_EMBED_SELECTED,
  Node_Type.HTML
);

export const isPollsSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_POLLS_SELECTED,
  Node_Type.POLL
);

export const isButtonSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_BUTTON_SELECTED,
  Node_Type.BUTTON
);

export const isCollapsibleListSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_COLLAPSIBLE_LIST_SELECTED,
  Node_Type.COLLAPSIBLE_LIST
);

export const isTableSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_TABLE_SELECTED,
  Node_Type.TABLE
);

export const isGifSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_GIF_SELECTED,
  Node_Type.GIF
);

export const isMapSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_MAP_SELECTED,
  Node_Type.MAP
);

export const isSocialEmbedSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_SOCIAL_EMBED_SELECTED,
  Node_Type.EMBED
);

export const isVerticalEmbedSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_VERTICAL_EMBED_SELECTED,
  Node_Type.APP_EMBED
);

export const isDividerSelected = getPluginSelectedResolver(
  RESOLVERS_IDS.IS_DIVIDER_SELECTED,
  Node_Type.DIVIDER
);

export const getNodeInSelectionResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_NODE_IN_SELECTION,
  content => {
    if (Array.isArray(content) && content.length > 0) {
      return content[0];
    } else {
      return undefined;
    }
  }
);

const pluginSelectedResolvers = [
  isImageSelected,
  isVideoSelected,
  isGallerySelected,
  isDividerSelected,
  isVerticalEmbedSelected,
  isSocialEmbedSelected,
  isMapSelected,
  isGifSelected,
  isTableSelected,
  isCollapsibleListSelected,
  isButtonSelected,
  isPollsSelected,
  isHtmlEmbedSelected,
  isAudioSelected,
  isFileSelected,
];

export const isPluginSelectedResolver = TiptapContentResolver.create(
  RESOLVERS_IDS.IS_PLUGIN_SELECTED,
  content => pluginSelectedResolvers.some(isPluginSelected => isPluginSelected.resolve(content))
);

export const getUrlLinkData = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_URL_LINK_DATA,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      if (node?.marks.some(mark => mark.type.name === Decoration_Type.LINK)) {
        return node.marks[0].attrs.link;
      }
    }
    return false;
  }
);

export const getAnchorLinkData = TiptapContentResolver.create(
  RESOLVERS_IDS.GET_ANCHOR_LINK_DATA,
  content => {
    if (Array.isArray(content)) {
      const node = content.find(node => {
        return node.type.name === 'text';
      });
      if (node?.marks.some(mark => mark.type.name === Decoration_Type.ANCHOR)) {
        return node.marks[0].attrs.anchor;
      }
    }
    return false;
  }
);
