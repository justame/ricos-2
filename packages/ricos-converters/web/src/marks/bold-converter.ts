import { Decoration_Type } from 'ricos-schema';
import type { TiptapMarkConverter } from '../types';

export const boldConverter: TiptapMarkConverter = {
  fromTiptap: {
    type: Decoration_Type.BOLD,
    convert: mark => {
      const { type: _, attrs } = mark;
      return {
        type: Decoration_Type.BOLD,
        ...attrs,
      };
    },
  },
  toTiptap: {
    type: Decoration_Type.BOLD,
    convert: decoration => {
      const { type: _, ...data } = decoration;
      return {
        type: Decoration_Type.BOLD,
        attrs: { ...data },
      };
    },
  },
};
