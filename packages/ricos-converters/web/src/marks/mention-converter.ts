import type { MentionData } from 'ricos-schema';
import { Decoration_Type } from 'ricos-schema';
import type { TiptapMarkConverter } from '../types';

export const mentionConverter: TiptapMarkConverter = {
  fromTiptap: {
    type: Decoration_Type.MENTION,
    convert: mark => {
      const { attrs = {} } = mark;
      const { mentionId, ...rest } = attrs;
      return {
        type: Decoration_Type.MENTION,
        mentionData: { ...rest, id: mentionId } as MentionData,
      };
    },
  },
  toTiptap: {
    type: Decoration_Type.MENTION,
    convert: decoration => {
      const { mentionData } = decoration;
      const { id, ...rest } = mentionData || {};
      return {
        type: Decoration_Type.MENTION,
        attrs: { ...rest, mentionId: id },
      };
    },
  },
};
