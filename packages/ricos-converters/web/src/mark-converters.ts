// TODO: distribute specific implementations to appropriate packages

import type { Decoration, Decoration_Type } from 'ricos-schema';
import { anchorConverter } from './marks/anchor-converter';
import { boldConverter } from './marks/bold-converter';
import { colorConverter } from './marks/color-converter';
import { fontSizeConverter } from './marks/font-size-converter';
import { italicConverter } from './marks/italic-converter';
import { linkConverter } from './marks/link-converter';
import { mentionConverter } from './marks/mention-converter';
import { spoilerConverter } from './marks/spoiler-converter';
import { underlineConverter } from './marks/underline-converter';
import type { TiptapMark, TiptapMarkConverter } from './types';

export const getUnsupportedDecorationToTiptap = (
  decoration: Decoration
): TiptapMarkConverter['toTiptap'] => ({
  types: [decoration.type],
  convert: decoration => {
    const { type, ...data } = decoration;
    return {
      ...(data ? { attrs: { ...data } } : {}),
      type,
    };
  },
});

export const getUnsupportedMarkFromTiptap = (
  mark: TiptapMark
): TiptapMarkConverter['fromTiptap'] => ({
  types: [mark.type],
  convert: mark => {
    const { type, attrs, ...data } = mark;
    return {
      type: type as Decoration_Type,
      ...data,
      ...attrs,
    };
  },
});

export const markConverters = [
  anchorConverter,
  boldConverter,
  colorConverter,
  fontSizeConverter,
  italicConverter,
  linkConverter,
  mentionConverter,
  spoilerConverter,
  underlineConverter,
];
