import { TextStyle_TextAlignment } from 'ricos-schema';
import { getTextDirection } from 'wix-rich-content-common';

export const getTextDirectionFromAlignment = (textAlignment: TextStyle_TextAlignment | undefined) =>
  textAlignment === TextStyle_TextAlignment.RIGHT
    ? 'rtl'
    : textAlignment === TextStyle_TextAlignment.LEFT
    ? 'ltr'
    : undefined;

export const getListItemDirection = (
  textAlignment: TextStyle_TextAlignment | undefined,
  text?: string
) => {
  const textDirection = ['ltr', 'rtl'].includes(getTextDirection(text))
    ? getTextDirection(text)
    : 'ltr';
  return getTextDirectionFromAlignment(textAlignment) || textDirection;
};
