import type { Node as TiptapNode } from 'prosemirror-model';
import {
  alwaysVisibleResolver,
  isTextContainsBoldResolver,
  isTextContainsItalicResolver,
  isTextContainsUnderlineResolver,
  isTextContainsQuoteResolver,
  isTextContainsCodeblockResolver,
  isTextContainsOrderedListResolver,
  isTextContainsUnorderedListResolver,
  isTextContainsSpoilerResolver,
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
} from './tiptapResolvers';

import toCamelCase from 'to-camel-case';
import { Node_Type, Decoration_Type } from 'ricos-schema';
import type { IContentResolver } from 'ricos-types';

const pluginSelectedResolvers = {
  [Node_Type.IMAGE]: isImageSelected,
  [Node_Type.VIDEO]: isVideoSelected,
  [Node_Type.GALLERY]: isGallerySelected,
  [Node_Type.FILE]: isFileSelected,
  [Node_Type.AUDIO]: isAudioSelected,
  [Node_Type.HTML]: isHtmlEmbedSelected,
  [Node_Type.POLL]: isPollsSelected,
  [Node_Type.BUTTON]: isButtonSelected,
  [Node_Type.COLLAPSIBLE_LIST]: isCollapsibleListSelected,
  [Node_Type.TABLE]: isTableSelected,
  [Node_Type.GIF]: isGifSelected,
  [Node_Type.MAP]: isMapSelected,
  [Node_Type.EMBED]: isSocialEmbedSelected,
  [Node_Type.APP_EMBED]: isVerticalEmbedSelected,
  [Node_Type.DIVIDER]: isDividerSelected,
};

describe('tiptap resolvers', () => {
  describe('alwaysVisibleResolver', () => {
    it('should always return true', () => {
      const mockContent = [{ type: Node_Type.PARAGRAPH }];
      expect(alwaysVisibleResolver.resolve(mockContent as unknown as TiptapNode[])).toBe(true);
    });
  });

  describe('isTextContainsBold', () => {
    it('should return true if selected text is bold', () => {
      const mockContentWithBold = [
        {
          type: { name: 'text' },
          marks: [{ type: { name: Decoration_Type.BOLD } }],
          text: 'World',
        },
      ];
      expect(isTextContainsBoldResolver.resolve(mockContentWithBold as TiptapNode[])).toBe(true);
    });

    it('should return false if selected text is not bold', () => {
      const mockContentWithoutBold = [
        {
          type: { name: 'text' },
          marks: [{ type: { name: Decoration_Type.UNDERLINE } }],
          text: 'World',
        },
      ];
      expect(isTextContainsBoldResolver.resolve(mockContentWithoutBold as TiptapNode[])).toBe(
        false
      );
    });
  });

  describe('isTextContainsItalicResolver', () => {
    it('should return true if selected text is italic', () => {
      const mockContentWithItalic = [
        {
          type: { name: 'text' },
          marks: [{ type: { name: Decoration_Type.ITALIC } }],
          text: 'World',
        },
      ];
      expect(isTextContainsItalicResolver.resolve(mockContentWithItalic as TiptapNode[])).toBe(
        true
      );
    });

    it('should return false if selected text is not italic', () => {
      const mockContentWithoutItalic = [
        {
          type: { name: 'text' },
          marks: [{ type: { name: Decoration_Type.BOLD } }],
          text: 'World',
        },
      ];
      expect(isTextContainsItalicResolver.resolve(mockContentWithoutItalic as TiptapNode[])).toBe(
        false
      );
    });
  });

  describe('isTextContainsUnderlineResolver', () => {
    it('should return true if selected text is underline', () => {
      const mockContentWithUnderline = [
        {
          type: { name: 'text' },
          marks: [{ type: { name: Decoration_Type.UNDERLINE } }],
          text: 'World',
        },
      ];
      expect(
        isTextContainsUnderlineResolver.resolve(mockContentWithUnderline as TiptapNode[])
      ).toBe(true);
    });

    it('should return false if selected text is not underline', () => {
      const mockContentWithoutUnderline = [
        {
          type: { name: 'text' },
          marks: [{ type: { name: Decoration_Type.ITALIC } }],
          text: 'World',
        },
      ];
      expect(
        isTextContainsUnderlineResolver.resolve(mockContentWithoutUnderline as TiptapNode[])
      ).toBe(false);
    });
  });

  describe('isTextContainsQuoteResolver', () => {
    it('should return true if selected text is quote', () => {
      const mockContent = [{ type: { name: Node_Type.BLOCKQUOTE } }];
      expect(isTextContainsQuoteResolver.resolve(mockContent as TiptapNode[])).toBe(true);
    });

    it('should return false if selected text is not quote', () => {
      const mockContentWithoutGif = [{ type: { name: 'text' } }];
      expect(isTextContainsQuoteResolver.resolve(mockContentWithoutGif as TiptapNode[])).toBe(
        false
      );
    });
  });

  describe('isTextContainsCodeblockResolver', () => {
    it('should return true if selected text is code block', () => {
      const mockContent = [{ type: { name: Node_Type.CODE_BLOCK } }];
      expect(isTextContainsCodeblockResolver.resolve(mockContent as TiptapNode[])).toBe(true);
    });

    it('should return false if selected text is not code block', () => {
      const mockContentWithoutGif = [{ type: { name: 'text' } }];
      expect(isTextContainsCodeblockResolver.resolve(mockContentWithoutGif as TiptapNode[])).toBe(
        false
      );
    });
  });

  describe('isTextContainsOrderedListResolver', () => {
    it('should return true if selected text is ordered list', () => {
      const mockContent = [{ type: { name: Node_Type.ORDERED_LIST } }];
      expect(isTextContainsOrderedListResolver.resolve(mockContent as TiptapNode[])).toBe(true);
    });

    it('should return false if selected text is not ordered list', () => {
      const mockContentWithoutGif = [{ type: { name: 'text' } }];
      expect(isTextContainsOrderedListResolver.resolve(mockContentWithoutGif as TiptapNode[])).toBe(
        false
      );
    });
  });

  describe('isTextContainsUnorderedListResolver', () => {
    it('should return true if selected text is unordered list', () => {
      const mockContent = [{ type: { name: Node_Type.BULLETED_LIST } }];
      expect(isTextContainsUnorderedListResolver.resolve(mockContent as TiptapNode[])).toBe(true);
    });

    it('should return false if selected text is not unordered list', () => {
      const mockContentWithoutGif = [{ type: { name: 'text' } }];
      expect(
        isTextContainsUnorderedListResolver.resolve(mockContentWithoutGif as TiptapNode[])
      ).toBe(false);
    });
  });

  describe('isTextContainsSpoilerResolver', () => {
    it('should return true if selected text is spoiler', () => {
      const mockContent = [
        {
          type: { name: 'text' },
          marks: [{ type: { name: Decoration_Type.SPOILER } }],
          text: 'World',
        },
      ];
      expect(isTextContainsSpoilerResolver.resolve(mockContent as TiptapNode[])).toBe(true);
    });

    it('should return false if selected text is not spoiler', () => {
      const mockContent = [
        {
          type: { name: 'text' },
          marks: [{ type: { name: Decoration_Type.ITALIC } }],
          text: 'World',
        },
      ];
      expect(isTextContainsSpoilerResolver.resolve(mockContent as TiptapNode[])).toBe(false);
    });
  });

  describe('Plugin Selected Resolvers', () => {
    Object.entries(pluginSelectedResolvers).forEach(
      ([type, isPluginSelectedResolver]: [Node_Type, IContentResolver<TiptapNode[]>]) => {
        it(`should return true if ${type} is selected`, () => {
          const mockContentWithPlugin = [{ type: { name: type } }];
          expect(isPluginSelectedResolver.resolve(mockContentWithPlugin as TiptapNode[])).toBe(
            true
          );
        });

        it(`should return false if ${type} is not selected`, () => {
          const mockContentWithoutPlugin = [{ type: { name: 'text' } }];
          expect(isPluginSelectedResolver.resolve(mockContentWithoutPlugin as TiptapNode[])).toBe(
            false
          );
        });
      }
    );
  });
});
