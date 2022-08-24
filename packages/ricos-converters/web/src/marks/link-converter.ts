import { Decoration_Type } from 'ricos-schema';
import type { TiptapMarkConverter } from '../types';

export const linkConverter: TiptapMarkConverter = {
  fromTiptap: {
    types: [Decoration_Type.LINK],
    convert: mark => {
      const { attrs } = mark;
      return {
        type: Decoration_Type.LINK,
        linkData: { ...attrs },
      };
    },
  },
  toTiptap: {
    types: [Decoration_Type.LINK],
    convert: decoration => {
      const { linkData } = decoration;
      return {
        type: Decoration_Type.LINK,
        attrs: { ...linkData },
      };
    },
  },
};
