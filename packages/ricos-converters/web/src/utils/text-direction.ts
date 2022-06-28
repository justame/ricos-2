import { TextStyle_TextAlignment } from 'ricos-schema';

export const getTextDirectionFromAlignment = (textAlignment: TextStyle_TextAlignment | undefined) =>
  textAlignment === TextStyle_TextAlignment.RIGHT
    ? 'rtl'
    : textAlignment === TextStyle_TextAlignment.LEFT
    ? 'ltr'
    : undefined;
