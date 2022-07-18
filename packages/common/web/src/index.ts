export * from 'ricos-types';

// Components
export { default as AccessibilityListener } from './Components/AccessibilityListener';

// Utils
export { default as withI18n, translate, Trans, RicosTranslate } from './Utils/withI18n';
export { default as createHocName } from './Utils/createHocName';
export {
  sizeClassName,
  alignmentClassName,
  textWrapClassName,
  depthClassName,
} from './Utils/classNameStrategies';
export { mergeStyles } from './Utils/mergeStyles';
export {
  convertRelObjectToString,
  convertRelStringToObject,
  convertTargetStringToBoolean,
  convertTargetBooleanToString,
  getRelValue,
} from './Utils/linkConverters';
export { safeJsonParse } from './Utils/jsonUtils';

export { anchorScroll, addAnchorTagToUrl, isNewTab } from './Utils/anchor';

export { defaultMobileFontSizes, defaultFontSizes } from './Utils/fontSizeUtils';

export * from 'ricos-content';

export { default as getDisplayName } from './Utils/getDisplayName';

export { hasLinksInBlock, getLinkRangesInBlock } from './Utils/draftUtils';
export { validate, getContentStateSchema } from './Utils/data-schema-validator';
export { isSSR } from './Utils/ssrUtils';
export { getDirectionFromAlignmentAndTextDirection } from './Utils/textDirection';
export { GlobalContext } from './Utils/contexts';

export { isHexColor } from './Utils/colorUtils';
export { isRtl, getLangDir } from './Utils/rtlUtils';

export { simplePubsub } from './Utils/simplePubsub';
// export type { Pubsub, Store } from './Utils/simplePubsub';
export { generateKey } from './Utils/generateKey';
export { getBlocksFromContentState } from './Utils/innerRCEBlocksUtils';
export { default as getTextDirection } from 'ricos-content/libs/getTextDirection';
export * from './consts';

export { default as createJustificationFixDecorator } from './draftDecorators/createJustificationFixDecorator';

export {
  parseStyleByType,
  INLINE_STYLE_TYPES,
  defaultStyleFnMapper,
  dynamicStyleParsers,
  getDynamicInlineStyleMapper,
  draftDecorationsToCss,
} from './Utils/viewerUtils';
export type { CustomInlineStyleType } from './Utils/viewerUtils';

export { default as uuid } from './Utils/uuid';
