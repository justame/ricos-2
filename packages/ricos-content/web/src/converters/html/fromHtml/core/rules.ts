import { pipe, flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';

import type { TextNode, Element } from 'parse5';
import type { ImageData, Decoration, ColorData } from 'ricos-schema';
import { Node_Type, Decoration_Type, PluginContainerData_Alignment } from 'ricos-schema';
import {
  getAttributes,
  getStyle,
  hasStyleFor,
  isText,
  toName,
  hasTag,
  oneOf,
} from './parse5-utils';
import { and } from '../../../../fp-utils';
import type { Context, Rule } from './models';
import {
  createTextNode,
  createParagraphNode,
  createHeadingNode,
  createNode,
  createLink,
} from '../../../nodeUtils';

export const identityRule: Rule = [
  () => true,
  ({ visit }) =>
    (node: Element) =>
      visit(node),
];

export const textToText: Rule = [
  isText,
  context => (node: TextNode) => [createTextNode(node.value, context.decorations)],
];

export const pToParagraph: Rule = [
  hasTag('p'),
  context => (node: Element) => [createParagraphNode(context.visit(node))],
];

export const hToHeading: Rule = [
  flow(toName, /h[1-6]/.test.bind(/h[1-6]/)),
  context => (node: Element) =>
    [
      createHeadingNode(context.visit(node), {
        level: Number(node.nodeName.replace('h', '')),
      }),
    ],
];

export const aToLink: Rule = [
  and([hasTag('a'), flow(getAttributes, ({ href }) => !href?.startsWith('#'))]),
  context => (node: Element) => {
    const attrs = getAttributes(node);
    return context.addDecoration(
      Decoration_Type.LINK,
      { linkData: { link: createLink({ ...attrs, url: attrs.href }) } },
      node
    );
  },
];

export const aToAnchor: Rule = [
  and([hasTag('a'), flow(getAttributes, ({ href }) => !!href && href.startsWith('#'))]),
  context => (node: Element) => {
    const attrs = getAttributes(node);
    return context.addDecoration(
      Decoration_Type.ANCHOR,
      { anchorData: { ...attrs, anchor: attrs.href.substr(1) } },
      node
    );
  },
];

export const lToList: Rule = [
  oneOf(['ul', 'ol', 'li']),
  context => (node: Element) =>
    [
      createNode(
        {
          ul: Node_Type.BULLETED_LIST,
          ol: Node_Type.ORDERED_LIST,
          li: Node_Type.LIST_ITEM,
        }[node.nodeName as Node_Type],
        {
          nodes: context.visit(node),
          data: {},
        }
      ),
    ],
];

export const strongEmUToDecoration: Rule = [
  oneOf(['strong', 'em', 'u']),
  context => (node: Element) =>
    context.addDecoration(
      { strong: Decoration_Type.BOLD, em: Decoration_Type.ITALIC, u: Decoration_Type.UNDERLINE }[
        node.nodeName as Decoration_Type
      ],
      {},
      node
    ),
];

const toForegroundData = (color: string): Decoration['colorData'] => ({
  foreground: color,
});

const toBackgroundData = (color: string): Decoration['colorData'] => ({
  background: color,
});

const toColorDecoration = (ctx: Context, el: Element) => (colorData: ColorData) =>
  ctx.addDecoration(Decoration_Type.COLOR, { colorData }, el);

export const colorStyleToTextColor: Rule = [
  and([hasTag('span'), hasStyleFor('color')]),
  context => (el: Element) =>
    pipe(
      el,
      getStyle,
      O.chain(R.lookup('color')),
      O.map(toForegroundData),
      O.fold(() => [], toColorDecoration(context, el))
    ),
];

// NOTE: Mention's HTML representation is not interactive. Might be fixed in the future
export const spanToMention: Rule = [
  and([hasTag('span'), flow(getAttributes, attrs => !!attrs['data-mention-name'])]),
  context => (node: Element) => {
    const {
      'data-mention-name': name,
      'data-mention-slug': slug,
      'data-mention-id': id,
    } = getAttributes(node);
    return context.addDecoration(
      Decoration_Type.MENTION,
      { mentionData: { name, slug, id } },
      node
    );
  },
];

// NOTE: Spoiler's HTML representation is not interactive. Might be fixed in the future
export const spanToSpoiler: Rule = [
  and([hasTag('span'), flow(getAttributes, attrs => !!attrs['data-spoiler'])]),
  context => (node: Element) => context.addDecoration(Decoration_Type.SPOILER, {}, node),
];

export const backgroundStyleToTextHighlight: Rule = [
  and([hasTag('span'), hasStyleFor('background-color')]),
  context => (el: Element) =>
    pipe(
      el,
      getStyle,
      O.chain(R.lookup('background-color')),
      O.map(toBackgroundData),
      O.fold(() => [], toColorDecoration(context, el))
    ),
];

const toImageData = (decorations: Decoration[], node: Element): ImageData => {
  const attrs = getAttributes(node);
  return {
    image: { src: { url: attrs.src } },
    ...(attrs.width
      ? {
          containerData: {
            alignment: PluginContainerData_Alignment.CENTER,
            width: { size: undefined, custom: attrs.width },
          },
        }
      : {}),
    altText: attrs.alt,
    link: decorations
      .filter(({ type }) => type === Decoration_Type.LINK)
      .map(({ linkData }) => linkData?.link)[0],
  };
};

export const imgToImage: Rule = [
  hasTag('img'),
  context => (node: Element) =>
    [createNode(Node_Type.IMAGE, { nodes: [], data: toImageData(context.decorations, node) })],
];
