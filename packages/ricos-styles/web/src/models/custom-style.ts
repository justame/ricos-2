import type { CustomTextualStyle } from 'ricos-types';

export interface ICustomStyle {
  toCustomStyle: () => CustomTextualStyle;
  overrideWith: (customStyle: ICustomStyle) => ICustomStyle;
}
