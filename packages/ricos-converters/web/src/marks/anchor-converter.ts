import type { AnchorData } from 'ricos-schema';
import { Decoration_Type } from 'ricos-schema';
import type { TiptapMarkConverter } from '../types';

export const anchorConverter: TiptapMarkConverter = {
  fromTiptap: {
    types: [Decoration_Type.ANCHOR],
    convert: mark => {
      const { attrs } = mark;
      return {
        type: Decoration_Type.ANCHOR,
        anchorData: { ...attrs } as AnchorData,
      };
    },
  },
  toTiptap: {
    types: [Decoration_Type.ANCHOR],
    convert: decoration => {
      const { anchorData } = decoration;
      return {
        type: Decoration_Type.ANCHOR,
        attrs: { ...anchorData },
      };
    },
  },
};
