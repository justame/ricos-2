import type { RicosCustomStyles } from 'ricos-types';

export interface ICustomStyles {
  toCustomStyles: () => RicosCustomStyles;
  overrideWith: (customStyles: ICustomStyles) => ICustomStyles;
}
