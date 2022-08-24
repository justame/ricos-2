import type { DocumentStyle } from 'wix-rich-content-common';
import { DRAFT_TO_DOC_TYPE_WITH_LISTS } from 'wix-rich-content-common';

export const getFontSizeNumber = (fontSize: string) => {
  const pxRegex = new RegExp('[0-9]+[px]');
  return pxRegex.exec(fontSize) ? fontSize.split('p')[0] : '';
};

export const hasStyleChanges = (
  currentHeading: string,
  inlineStyles: Record<string, string>,
  documentStyle?: DocumentStyle
) => {
  const headerStyle = documentStyle?.[DRAFT_TO_DOC_TYPE_WITH_LISTS[currentHeading]] || {};
  return Object.entries(inlineStyles).some(([key, value]) => headerStyle[key] !== value);
};

export const findOsName = () => {
  if (navigator.userAgent.indexOf('Win') !== -1) return 'Windows';
  if (navigator.userAgent.indexOf('Mac') !== -1) return 'MacOS';
  return null;
};
