import CustomStyle from './custom-style';

export default class EmptyCustomStyle extends CustomStyle {
  constructor() {
    super('empty', {});
  }

  overrideWith(customStyle: CustomStyle): CustomStyle {
    return customStyle;
  }
}
