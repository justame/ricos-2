import { flow, identity } from 'fp-ts/function';
import { not } from 'fp-ts/Predicate';
import * as S from 'fp-ts/string';
import type { Attribute, Element, TextNode } from 'parse5';
import { serialize } from 'parse5';
import { and, or } from '../../../../fp-utils';
import { partitionBy } from '../../../nodeUtils';
import { traverse, traverseRoot } from '../core/ast-traversal';
import type { ContentNode } from '../core/models';
import type { AstRule } from '../core/parse5-utils';
import {
  appendChild,
  hasChild,
  hasClass,
  hasDescendant,
  hasParent,
  hasStyleFor,
  hasTag,
  isRoot,
  isText,
  isWhitespace,
  oneOf,
  toAst,
} from '../core/parse5-utils';

const addParagraph =
  (parentNode: Element, attrs: Attribute[] = []) =>
  (): ContentNode => ({
    nodeName: 'p',
    tagName: 'p',
    childNodes: [],
    parentNode,
    attrs: parentNode.attrs ? parentNode.attrs.concat(attrs) : attrs,
    namespaceURI: parentNode.namespaceURI,
  });

const rootTextToP: AstRule = [
  and([isRoot, or([hasChild(isText), hasChild(hasTag('a'))])]),
  (node: Element) => ({
    ...node,
    childNodes: partitionBy<ContentNode>(
      and([not(isText), not(hasTag('a')), not(hasClass(c => c === 'root-text-anchor'))]),
      and([hasTag('p'), hasClass(c => c === 'root-text-anchor')]),
      identity,
      addParagraph(node, [{ name: 'class', value: 'root-text-anchor' }]),
      appendChild
    )(node.childNodes),
  }),
];

const containerPToDiv: AstRule = [
  and([hasTag('p'), hasDescendant(oneOf(['img', 'iframe', 'ol', 'ul']))]),
  (node: Element) => ({
    ...node,
    tagName: 'div',
    nodeName: 'div',
    childNodes: partitionBy<ContentNode>(
      hasDescendant(oneOf(['img', 'iframe', 'ol', 'ul'])),
      hasTag('p'),
      identity,
      addParagraph(node),
      appendChild
    )(node.childNodes),
  }),
];

const collapseWhitespaces: AstRule = [
  and([
    isText,
    isWhitespace,
    hasParent(not(oneOf(['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']))),
  ]),
  (node: TextNode) => ({
    ...node,
    value: '',
  }),
];

const wrapPWithLiInList: AstRule = [
  and([hasTag('p'), hasParent(oneOf(['ul', 'ol']))]),
  (node: Element) => {
    const listItem: Element = {
      nodeName: 'li',
      tagName: 'li',
      childNodes: [] as Element[],
      attrs: [] as Attribute[],
      parentNode: node.parentNode,
      namespaceURI: node.namespaceURI,
    };
    const childNode: Element = { ...node, parentNode: listItem };
    listItem.childNodes.push(childNode);
    return listItem;
  },
];

const cleanListPadding: AstRule = [
  oneOf(['ol', 'ul']),
  (node: Element) => ({
    ...node,
    childNodes: (node.childNodes as Element[]).filter(not(isText)),
  }),
];

const cleanListItemPadding: AstRule = [
  hasTag('li'),
  (el: Element) => ({
    ...el,
    childNodes: (el.childNodes as Element[]).filter(and([not(hasTag('br')), not(isWhitespace)])),
  }),
];

const cleanInvalidVideos: AstRule = [
  and([
    hasTag('div'),
    hasClass(c => c === 'container-video'),
    not(hasDescendant(hasTag('iframe'))),
  ]),
  (node: Element) => ({
    ...node,
    childNodes: [],
  }),
];

const wrapTextUnderLi: AstRule = [
  and([hasTag('li'), or([hasChild(isText), hasChild(oneOf(['a', 'u', 'em', 'strong']))])]),
  (node: Element) => ({
    ...node,
    childNodes: partitionBy<ContentNode>(
      or([
        hasTag('p'),
        hasDescendant(oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'iframe', 'ol', 'ul'])),
      ]),
      hasTag('p'),
      identity,
      addParagraph(node),
      appendChild
    )(node.childNodes),
  }),
];

const wrapNakedStyledSpanWithP: AstRule = [
  and([
    hasTag('span'),
    or([hasStyleFor('text-decoration'), hasStyleFor('font-weight'), hasStyleFor('font-style')]),
    hasParent(not(oneOf(['strong', 'b', 'a', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']))),
  ]),
  (node: Element) => {
    const paragraph: Element = {
      nodeName: 'p',
      tagName: 'p',
      childNodes: [] as Element[],
      attrs: [] as Attribute[],
      parentNode: node.parentNode,
      namespaceURI: node.namespaceURI,
    };
    const childNode: Element = { ...node, parentNode: paragraph };
    paragraph.childNodes.push(childNode);
    return paragraph;
  },
];

const nakedSpanToP: AstRule = [
  and([
    hasTag('span'),
    not(hasStyleFor('text-decoration')),
    not(hasStyleFor('font-weight')),
    not(hasStyleFor('font-style')),
    hasParent(not(oneOf(['strong', 'b', 'a', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']))),
  ]),
  (node: Element) => ({
    ...node,
    nodeName: 'p',
    tagName: 'p',
  }),
];

const textInDivToP: AstRule = [
  and([hasTag('div'), hasChild(isText)]),
  (node: Element) => ({
    ...node,
    childNodes: partitionBy<ContentNode>(
      and([not(isText), not(hasTag('p'))]),
      hasTag('p'),
      identity,
      addParagraph(node),
      appendChild
    )(node.childNodes),
  }),
];

const brToNewLineInRoot: AstRule = [
  and([hasTag('br'), not(hasParent(hasTag('p')))]),
  (node: Element) => ({
    parentNode: node.parentNode,
    nodeName: '#text',
    value: '_ROOT_NEW_LINE_MARKER_',
  }),
];

const brToNewLineInP: AstRule = [
  and([hasTag('br'), hasParent(hasTag('p'))]),
  (node: Element) => ({
    parentNode: node.parentNode,
    nodeName: '#text',
    value: '_P_NEW_LINE_MARKER_',
  }),
];

const collapseBreaks = flow(
  S.replace(/(_ROOT_NEW_LINE_MARKER_\s*){3}/gim, ' '),
  S.replace(/(_ROOT_NEW_LINE_MARKER_\s*){1,2}/gim, ''),
  S.replace(/(_P_NEW_LINE_MARKER_\s*){3}/gim, '\n\n'),
  S.replace(/(_P_NEW_LINE_MARKER_\s*){2}/gim, '\n'),
  S.replace(/(_P_NEW_LINE_MARKER_\s*){1}/gim, '')
);

export const preprocess = flow(
  toAst,
  traverseRoot(rootTextToP),
  flow(traverse(brToNewLineInP), traverse(brToNewLineInRoot)),
  flow(
    traverse(cleanListPadding),
    traverse(cleanListItemPadding),
    traverse(wrapPWithLiInList),
    traverse(cleanInvalidVideos),
    traverse(containerPToDiv)
  ),
  flow(traverse(wrapTextUnderLi), traverse(collapseWhitespaces)),
  // hack to make nakedSpanToP work -- otherwise does not work correctly
  flow(serialize, toAst, traverse(nakedSpanToP), traverse(wrapNakedStyledSpanWithP)),
  traverse(textInDivToP),
  serialize,
  collapseBreaks
);
