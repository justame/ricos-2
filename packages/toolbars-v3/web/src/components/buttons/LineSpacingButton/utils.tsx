import { omitBy, isNil } from 'lodash';
const defaultLineSpacing = {
  'line-height': '1.5',
  'padding-top': '2px',
  'padding-bottom': '3px',
};

export const getCurrentSelection = (toolbarItem, defaultLineSpacingFromApi) => {
  const spacingFromContent = {
    'line-height': toolbarItem.attributes.selectedLineSpacing,
    'padding-top': toolbarItem.attributes.selectedLineSpacingBefore,
    'padding-bottom': toolbarItem.attributes.selectedLineSpacingAfter,
  };

  return {
    ...defaultLineSpacing,
    ...omitBy(defaultLineSpacingFromApi, isNil),
    ...omitBy(spacingFromContent, isNil),
  };
};
