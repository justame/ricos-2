import type { BasicKeyCombination } from 'ricos-types';
import { Keys } from './keys';

describe('Keys', () => {
  it('should parse valid keys combination', () => {
    const actual = Keys.parse('Shift+Meta+Z').toString();
    expect(actual).toEqual('Meta+Shift+Z');
  });

  it('should throw KeyboardShortcutParseError on invalid keys', () => {
    ['bad', '', 'Shift+Alt', 'Z+', 'Ctrl+A+', 'Alt+Test'].forEach((keys: BasicKeyCombination) => {
      expect(() => Keys.parse(keys)).toThrow(/invalid keys combination/);
    });
  });

  it('should stringify keys', () => {
    ['Ctrl+A', '?', 'Alt+Tab', 'Shift+Enter', 'Alt+Ctrl+S'].forEach((keys: BasicKeyCombination) =>
      expect(Keys.parse(keys).toString()).toEqual(keys)
    );
    expect(Keys.parse('Meta+Alt+B').toString()).toEqual('Alt+Meta+B');
  });
});
