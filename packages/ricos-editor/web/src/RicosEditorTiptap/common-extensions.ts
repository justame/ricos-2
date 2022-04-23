import {
  createBulletedList,
  createBold,
  createItalic,
  createUnderline,
  createListItem,
  createBlockquote,
  createOrderedList,
  createLink,
  createPlaceholder,
  createFontSize,
  createTextAlign,
  createCharacterCount,
} from 'wix-tiptap-extensions';

export const commonExtensions = [
  createPlaceholder({}),
  createBulletedList(),
  createBold(),
  createItalic(),
  createUnderline(),
  createListItem(),
  createBlockquote(),
  createOrderedList(),
  createLink({}),
  createFontSize(),
  createTextAlign(),
  createCharacterCount(),
];
