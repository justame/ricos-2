import { Decoration_Type } from 'ricos-schema';
import type { TiptapMarkConverter } from '../types';

export const underlineConverter: TiptapMarkConverter = {
  fromTiptap: {
    types: [Decoration_Type.UNDERLINE],
    convert: mark => {
      const { type: _, attrs } = mark;
      return {
        type: Decoration_Type.UNDERLINE,
        ...attrs,
      };
    },
  },
  toTiptap: {
    types: [Decoration_Type.UNDERLINE],
    convert: decoration => {
      const { type: _, ...data } = decoration;
      return {
        type: Decoration_Type.UNDERLINE,
        attrs: { ...data },
      };
    },
  },
};
