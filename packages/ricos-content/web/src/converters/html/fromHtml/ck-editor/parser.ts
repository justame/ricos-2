import * as A from 'fp-ts/Array';
import { flow, identity, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { not } from 'fp-ts/Predicate';
import * as RONEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as R from 'fp-ts/Record';
import * as S from 'fp-ts/string';
import type { Element } from 'parse5';
import type { Node, PluginContainerData, TextStyle, TextStyle_TextAlignment } from 'ricos-schema';
import { Decoration_Type, PluginContainerData_Alignment } from 'ricos-schema';
import { and, or } from '../../../../fp-utils';
import { createParagraphNode } from '../../../nodeUtils';
import {
  getClassNames,
  getStyle,
  hasParent,
  hasStyleFor,
  hasStyleRule,
  hasTag,
  isRoot,
  isText,
  isWhitespace,
  hasChild,
  oneOf,
} from '../core/parse5-utils';
import parse from '../core/parser';
import {
  hToHeading,
  identityRule,
  imgToImage,
  lToList,
  pToParagraph,
  textToText,
  backgroundStyleToTextHighlight,
  colorStyleToTextColor,
} from '../core/rules';
import { aToCustomLink } from './aToCustomLink';
import type { Rule } from '../core/models';
import { iframeToYoutubeVideo, iframeToVimeoVideo } from './iframeToVideo';
import postprocess from './postprocess';
import { preprocess } from './preprocess';

const noEmptyLineText: Rule = [
  and([isText, not(isWhitespace), not(hasParent(isRoot))]),
  textToText[1],
];

// TODO: remove direct nodeUtils usage
const rootTextToP: Rule = [
  and([isText, hasParent(isRoot)]),
  ctx => el => [createParagraphNode(textToText[1](ctx)(el))],
];

const traverseDiv: Rule = [hasTag('div'), identityRule[1]];

const traverseSpan: Rule = [
  and([
    hasTag('span'),
    not(hasStyleFor('font-weight')),
    not(hasStyleFor('font-style')),
    not(hasStyleFor('text-decoration')),
    not(hasStyleFor('color')),
    not(hasStyleFor('background-color')),
  ]),
  identityRule[1],
];

const fontStyleToItalic: Rule = [
  or([hasTag('em'), and([hasTag('span'), hasStyleRule({ 'font-style': 'italic' })])]),
  ({ addDecoration }) =>
    (el: Element) =>
      addDecoration(Decoration_Type.ITALIC, {}, el),
];

const fontWeightToBold: Rule = [
  or([oneOf(['b', 'strong']), and([hasTag('span'), hasStyleRule({ 'font-weight': 'bold' })])]),
  ({ addDecoration }) =>
    (el: Element) =>
      addDecoration(Decoration_Type.BOLD, {}, el),
];

const textDecorationToUnderline: Rule = [
  or([hasTag('u'), and([hasTag('span'), hasStyleRule({ 'text-decoration': 'underline' })])]),
  ({ addDecoration }) =>
    (el: Element) =>
      addDecoration(Decoration_Type.UNDERLINE, {}, el),
];

type Alignment = 'LEFT' | 'RIGHT' | 'CENTER' | '';

const alignmentToTextStyle = (alignment: Alignment): Partial<TextStyle> => ({
  textAlignment: alignment as TextStyle_TextAlignment,
});

const alignmentToContainerData = (align: Alignment) => ({
  alignment: align as PluginContainerData_Alignment,
});

const getAlignment = flow(
  RONEA.filter((c: string) => ['align-left', 'align-right', 'align-center'].includes(c)),
  O.map(RONEA.head),
  O.map(S.replace('align-', '')),
  O.fold(() => '', S.toUpperCase)
);

const getAlignmentByClass = flow(getClassNames, getAlignment);
const hasAlignmentClass = flow(getAlignmentByClass, Boolean);

const mergeWithTextStyle = (dataProp: string, textStyle: Partial<TextStyle>) => (node: Node) => ({
  ...node,
  [dataProp]: { ...node[dataProp], textStyle: { ...node[dataProp].textStyle, ...textStyle } },
});

const mergeWithContainerData =
  (dataProp: string, containerData: PluginContainerData) => (node: Node) => ({
    ...node,
    [dataProp]: {
      ...node[dataProp],
      containerData: { ...node[dataProp].containerData, ...containerData },
    },
  });

const lineHeightToTextStyle = (lineHeight?: string): Partial<TextStyle> => ({ lineHeight });

const getLineHeight = flow(
  getStyle,
  O.chain(R.lookup('line-height')),
  O.fold(() => '', identity)
);

const pWitTextToStyledParagraph: Rule = [
  and([pToParagraph[0], hasChild(not(isWhitespace))]),
  context => (element: Element) =>
    pipe(
      element,
      pToParagraph[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithTextStyle(
              'paragraphData',
              pipe(element, getAlignmentByClass, alignmentToTextStyle)
            )
          : identity
      ),
      A.map(
        hasStyleFor('line-height')(element)
          ? mergeWithTextStyle('paragraphData', pipe(element, getLineHeight, lineHeightToTextStyle))
          : identity
      )
    ),
];

const hToStyledHeading: Rule = [
  hToHeading[0],
  context => (element: Element) =>
    pipe(
      element,
      hToHeading[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithTextStyle(
              'headingData',
              pipe(element, getAlignmentByClass, alignmentToTextStyle)
            )
          : identity
      ),
      A.map(
        hasStyleFor('line-height')(element)
          ? mergeWithTextStyle('headingData', pipe(element, getLineHeight, lineHeightToTextStyle))
          : identity
      )
    ),
];

const iframeToAlignedVimeoVideo: Rule = [
  iframeToVimeoVideo[0],
  context => (element: Element) => {
    return pipe(
      element,
      iframeToVimeoVideo[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithContainerData(
              'videoData',
              pipe(element, getAlignmentByClass, alignmentToContainerData)
            )
          : identity
      )
    );
  },
];

const iframeToAlignedYoutubeVideo: Rule = [
  iframeToYoutubeVideo[0],
  context => (element: Element) => {
    return pipe(
      element,
      iframeToYoutubeVideo[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithContainerData(
              'videoData',
              pipe(element, getAlignmentByClass, alignmentToContainerData)
            )
          : identity
      )
    );
  },
];

const imgToAlignedImage: Rule = [
  imgToImage[0],
  context => (element: Element) => {
    return pipe(
      element,
      imgToImage[1](context),
      A.map(
        hasAlignmentClass(element)
          ? mergeWithContainerData(
              'imageData',
              pipe(element, getAlignmentByClass, alignmentToContainerData)
            )
          : mergeWithContainerData('imageData', {
              alignment: PluginContainerData_Alignment.CENTER,
            })
      )
    );
  },
];

export default flow(
  preprocess,
  parse([
    noEmptyLineText,
    rootTextToP,
    pWitTextToStyledParagraph,
    lToList,
    hToStyledHeading,
    aToCustomLink,
    fontWeightToBold,
    fontStyleToItalic,
    colorStyleToTextColor,
    backgroundStyleToTextHighlight,
    textDecorationToUnderline,
    iframeToAlignedYoutubeVideo,
    iframeToAlignedVimeoVideo,
    imgToAlignedImage,
    traverseDiv,
    traverseSpan,
  ]),
  postprocess
);
