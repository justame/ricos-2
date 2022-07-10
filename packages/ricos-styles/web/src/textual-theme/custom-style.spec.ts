import CustomStyle from './custom-style';

describe('Custom Style', () => {
  it('Should getKey match expected', () => {
    const customStyle = new CustomStyle('h1', { backgroundColor: '#FFFFFF' });
    const expected = customStyle.getKey();
    expect(expected).toStrictEqual('h1');
  });

  it('Should overrideWith match expected', () => {
    const customStyle = new CustomStyle('h1', { backgroundColor: '#FFFFFF' });
    const expected = customStyle
      .overrideWith(new CustomStyle('h1', { color: '#818181' }))
      .toCustomStyle();
    expect(expected).toStrictEqual({ backgroundColor: '#FFFFFF', color: '#818181' });
  });
});
