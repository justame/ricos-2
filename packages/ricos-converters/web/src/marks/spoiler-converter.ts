import { Decoration_Type } from 'ricos-schema';
import type { TiptapMarkConverter } from '../types';

export const spoilerConverter: TiptapMarkConverter = {
  fromTiptap: {
    types: [Decoration_Type.SPOILER],
    convert: () => {
      return {
        type: Decoration_Type.SPOILER,
      };
    },
  },
  toTiptap: {
    types: [Decoration_Type.SPOILER],
    convert: () => {
      return {
        type: Decoration_Type.SPOILER,
      };
    },
  },
};
