import type { IsExternal } from 'rollup';

const externals = [
  /(wix-rich|ricos|wix-tiptap)/,
  /assert/,
  /axios/,
  /classnames/,
  /lodash/,
  /prop-types/,
  /react/,
  /react-dom/,
  /i18next/,
  /react-i18next/,
  /react-flip-move/,
  /react-hotkeys/,
  /image-client-api\/dist\/imageClientSDK/,
  /@wix\/draft-js/,
  /downshift/,
  /uuid/,
  /immutable/,
  /^punycode$/,
  /^jss$/, //issue with ESM in CJS
  /^jss-plugin-camel-case$/, //issue with ESM in CJS
  /^jss-plugin-nested$/, //issue with ESM in CJS
  /^jss-plugin-props-sort$/, //issue with ESM in CJS
  /^react-player$/,
  /^@loadable\/component$/,
  /@babel\/runtime/,
  /^@tiptap.*/,
  /prosemirror/,
  /linkifyjs/,
  /@wix\/image/,
  /wix-rich-content-toolbars-v3/,
  /rope-sequence/,
];

const excludedExternalsRegexArr = [/react-click-outsider/, /@tiptap/, /ricos-schema/, /\.scss/];

const localPrefixes = ['\0', '.', '/'];

export const isExternal: IsExternal = source => {
  const isNotExternal =
    localPrefixes.some(prefix => source.startsWith(prefix)) ||
    excludedExternalsRegexArr.some(regex => regex.test(source));
  return !isNotExternal && externals.some(regex => regex.test(source));
};
