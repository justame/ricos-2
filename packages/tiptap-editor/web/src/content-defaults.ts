import type { JSONContent } from '@tiptap/core';
import { Decoration_Type, Node_Type } from 'ricos-schema';
import appEmbedDefaults from 'ricos-schema/dist/statics/app_embed.defaults.json';
import collapsibleListDefaults from 'ricos-schema/dist/statics/collapsible_list.defaults.json';
import dividerDefaults from 'ricos-schema/dist/statics/divider.defaults.json';
import fileUploadDefaults from 'ricos-schema/dist/statics/file.defaults.json';
import galleryDefaults from 'ricos-schema/dist/statics/gallery.defaults.json';
import giphyDefaults from 'ricos-schema/dist/statics/gif.defaults.json';
import htmlDefaults from 'ricos-schema/dist/statics/html.defaults.json';
import imageDefaults from 'ricos-schema/dist/statics/image.defaults.json';
import linkPreviewDefaults from 'ricos-schema/dist/statics/link_preview.defaults.json';
import mapDefaults from 'ricos-schema/dist/statics/map.defaults.json';
import tableDefaults from 'ricos-schema/dist/statics/table.defaults.json';
import videoDefaults from 'ricos-schema/dist/statics/video.defaults.json';
import linkDefaults from 'ricos-schema/dist/statics/link.defaults.json';
import audioDefaults from 'ricos-schema/dist/statics/audio.defaults.json';
import blockquoteDefaults from 'ricos-schema/dist/statics/blockquote.defaults.json';
import codeBlockDefaults from 'ricos-schema/dist/statics/code_block.defaults.json';
import headingDefaults from 'ricos-schema/dist/statics/heading.defaults.json';
import orderedListDefaults from 'ricos-schema/dist/statics/ordered_list.defaults.json';
import paragraphDefaults from 'ricos-schema/dist/statics/paragraph.defaults.json';
import unorderedListDefaults from 'ricos-schema/dist/statics/bulleted_list.defaults.json';
import buttonDefaults from 'ricos-schema/dist/statics/button.defaults.json';
import embedDefaults from 'ricos-schema/dist/statics/embed.defaults.json';
import mentionsDefaults from 'ricos-schema/dist/statics/mention.defaults.json';
import pollDefaults from 'ricos-schema/dist/statics/poll.defaults.json';
import colorDefaults from 'ricos-schema/dist/statics/color.defaults.json';
import fontSizeDefaults from 'ricos-schema/dist/statics/font_size.defaults.json';
import { TIPTAP_ACTION_BUTTON_TYPE, TIPTAP_LINK_BUTTON_TYPE } from 'ricos-content';

export const contentDefaults: JSONContent[] = [
  {
    type: Node_Type.PARAGRAPH,
    attrs: {
      ...paragraphDefaults,
      id: 'foo',
    },
    content: [
      {
        type: 'text',
        text: '',
        marks: [
          {
            type: Decoration_Type.UNDERLINE,
          },
          {
            type: 'HASHTAG',
          },
          {
            type: Decoration_Type.LINK,
            attrs: linkDefaults,
          },
          {
            type: Decoration_Type.ANCHOR,
            attrs: linkDefaults,
          },
          {
            type: Decoration_Type.BOLD,
            attrs: {
              fontWeightValue: 700,
            },
          },
          {
            type: Decoration_Type.ITALIC,
            attrs: {
              italicData: true,
            },
          },
          {
            type: Decoration_Type.MENTION,
            attrs: mentionsDefaults,
          },
          {
            type: Decoration_Type.COLOR,
            attrs: colorDefaults,
          },
          {
            type: Decoration_Type.FONT_SIZE,
            attrs: fontSizeDefaults,
          },
          {
            type: Decoration_Type.SPOILER,
            attrs: colorDefaults,
          },
        ],
      },
    ],
  },
  {
    type: Node_Type.APP_EMBED,
    attrs: { ...appEmbedDefaults, id: 'foo' },
  },
  {
    type: Node_Type.DIVIDER,
    attrs: { ...dividerDefaults, id: 'foo' },
  },
  {
    type: Node_Type.FILE,
    attrs: { ...fileUploadDefaults, id: 'foo' },
  },
  {
    type: Node_Type.GALLERY,
    attrs: { ...galleryDefaults, id: 'foo' },
  },
  {
    type: Node_Type.GIF,
    attrs: { ...giphyDefaults, id: 'foo' },
  },
  {
    type: Node_Type.HTML,
    attrs: { ...htmlDefaults, id: 'foo' },
  },
  {
    type: Node_Type.IMAGE,
    attrs: { ...imageDefaults, id: 'foo' },
  },
  {
    type: Node_Type.MAP,
    attrs: { ...mapDefaults, id: 'foo' },
  },
  {
    type: Node_Type.VIDEO,
    attrs: { ...videoDefaults, id: 'foo' },
  },
  {
    type: Node_Type.COLLAPSIBLE_LIST,
    attrs: { ...collapsibleListDefaults, id: 'foo' },
  },
  {
    type: Node_Type.LINK_PREVIEW,
    attrs: { ...linkPreviewDefaults, id: 'foo' },
  },
  {
    type: Node_Type.TABLE,
    attrs: { ...tableDefaults, id: 'foo' },
  },
  {
    type: Node_Type.AUDIO,
    attrs: { ...audioDefaults, id: 'foo' },
  },
  {
    type: Node_Type.BLOCKQUOTE,
    attrs: { ...blockquoteDefaults, id: 'foo' },
  },
  {
    type: Node_Type.CODE_BLOCK,
    attrs: { ...codeBlockDefaults, id: 'foo' },
  },
  {
    type: Node_Type.HEADING,
    attrs: { ...headingDefaults, id: 'foo' },
  },
  {
    type: Node_Type.ORDERED_LIST,
    attrs: { ...orderedListDefaults, id: 'foo' },
  },
  {
    type: Node_Type.BULLETED_LIST,
    attrs: { ...unorderedListDefaults, id: 'foo' },
  },
  {
    type: TIPTAP_ACTION_BUTTON_TYPE,
    attrs: { ...buttonDefaults, id: 'foo' },
  },
  {
    type: TIPTAP_LINK_BUTTON_TYPE,
    attrs: { ...buttonDefaults, id: 'foo' },
  },
  {
    type: Node_Type.EMBED,
    attrs: { ...embedDefaults, id: 'foo' },
  },
  {
    type: Node_Type.POLL,
    attrs: { ...pollDefaults, id: 'foo' },
  },
];
