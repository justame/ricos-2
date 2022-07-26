import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { getMatches } from 'ricos-content';
import type { AnyKey, BasicKeyCombination, ModifierKeys, NavigationKeys } from 'ricos-types';
import { isAnyKey, isModifierKey } from 'ricos-types';
import type { WhitespaceKeys } from 'ricos-types/src';

export class KeyboardShortcutParseError extends Error {}

/**
 * Represents shortcut key combination
 *
 *
 * @export
 * @class Keys
 */
export class Keys {
  modifiers: ModifierKeys[];

  key: AnyKey;

  private readonly macOsMap: Record<ModifierKeys & WhitespaceKeys & NavigationKeys, string> = {
    Meta: '⌘',
    Ctrl: '⌃',
    Alt: '⌥',
    Shift: '⇧',
    Enter: '↩',
    Space: '␣',
    Backspace: '⌫',
    Tab: '⇥',
    Escape: '⎋',
    ArrowLeft: '←',
    ArrowRight: '→',
    ArrowUp: '↑',
    ArrowDown: '↓',
    Delete: '⌦',
    Home: '⇱',
    End: '⇲',
    PageUp: '⇞',
    PageDown: '⇟',
    Insert: '⌤',
    AltGraph: '⌥',
  };

  private readonly windowsMap: Record<ModifierKeys & WhitespaceKeys & NavigationKeys, string> = {
    Meta: 'Win',
    Ctrl: 'Ctrl',
    Alt: 'Alt',
    Shift: 'Shift',
    Enter: 'Enter',
    Space: 'Space',
    Backspace: 'Backspace',
    Tab: 'Tab',
    Escape: 'Escape',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    Delete: 'Delete',
    Home: 'Home',
    End: 'End',
    PageUp: 'PageUp',
    PageDown: 'PageDown',
    Insert: 'Insert',
    AltGraph: 'AltGr',
  };

  private static isValidKeys(key: AnyKey, modifiers: ModifierKeys[]): boolean {
    return isAnyKey(key) && !isModifierKey(key) && modifiers.filter(Boolean).every(isModifierKey);
  }

  private constructor(key: AnyKey, modifiers: ModifierKeys[] = []) {
    if (!Keys.isValidKeys(key, modifiers)) {
      throw new KeyboardShortcutParseError(
        `invalid keys combination: modifiers = ${modifiers.join('+')} | key = ${key}`
      );
    }
    this.modifiers = modifiers.filter(Boolean);
    this.key = key;
  }

  /**
   * Textual representation of parsed Keys:
   * ```ts
   *  `${modifiers}+${keys}`
   * ```
   * @memberof Keys
   */
  toString(): string {
    return `${
      this.modifiers.length > 0 ? this.modifiers.sort().filter(Boolean).join('+').concat('+') : ''
    }${this.key}`;
  }

  toPlatformString(platform: 'macOs' | 'windows'): string {
    return platform === 'macOs' ? this.toMacOsString() : this.toWindowsString();
  }

  private toMacOsString(): string {
    return this.modifiers
      .map(modifier => this.macOsMap[modifier])
      .concat(this.key)
      .join('');
  }

  private toWindowsString(): string {
    return this.modifiers
      .map(modifier => this.windowsMap[modifier])
      .concat(this.key)
      .join('+');
  }

  equals(keys: Keys) {
    return this.toString() === keys.toString();
  }

  /**
   * Parses keys string
   *
   * Example: 'Control+B' parsed to
   * ```ts
   *  {
   *    modifiers: ['Control'],
   *    key: ['B']
   *  }
   * ```
   *
   * @param {BasicKeyCombination} keys key combination
   * @returns  {Keys} Keys instance
   * @memberof Keys
   */
  static parse(keys: BasicKeyCombination): Keys {
    return pipe(
      keys,
      getMatches(/(?:([^+]+)\+)?(?:([^+]+)\+)?(.+)/gi),
      E.fromOption(() => new KeyboardShortcutParseError(`invalid keys combination: ${keys}`)),
      E.map(
        ([, modifier1, modifier2, key]: string[]) =>
          new Keys(key, [modifier1, modifier2].filter(Boolean) as ModifierKeys[])
      ),
      E.fold(e => {
        throw e;
      }, identity)
    );
  }
}
