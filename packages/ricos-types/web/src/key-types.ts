import type { LiteralUnion } from 'type-fest';

export type ModifierKeys =
  | 'Alt'
  | 'AltGraph'
  | 'CapsLock'
  | 'Ctrl'
  | 'Fn'
  | 'FnLock'
  | 'Hyper'
  | 'Meta'
  | 'NumLock'
  | 'ScrollLock'
  | 'Shift'
  | 'Super'
  | 'Symbol'
  | 'SymbolLock';

export const isModifierKey = (key: string): key is ModifierKeys =>
  [
    'Alt',
    'AltGraph',
    'CapsLock',
    'Ctrl',
    'Fn',
    'FnLock',
    'Hyper',
    'Meta',
    'NumLock',
    'ScrollLock',
    'Shift',
    'Super',
    'Symbol',
    'SymbolLock',
  ].includes(key);

export type WhitespaceKeys = 'Enter' | 'Tab' | ' ';

export const isWhitespaceKeys = (key: string): key is WhitespaceKeys =>
  ['Enter', 'Tab', ' '].includes(key);

export type NavigationKeys =
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'End'
  | 'Home'
  | 'PageDown'
  | 'PageUp'
  | 'Escape';

export const isNavigationKey = (key: string): key is NavigationKeys =>
  [
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'End',
    'Home',
    'PageDown',
    'PageUp',
    'Escape',
  ].includes(key);

export type FunctionKeys =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'
  | 'F13'
  | 'F14'
  | 'F15'
  | 'F16'
  | 'F17'
  | 'F18'
  | 'F19'
  | 'F20'
  | 'Soft1'
  | 'Soft2'
  | 'Soft3'
  | 'Soft4';

export const isFunctionKey = (key: string): key is FunctionKeys =>
  [
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'F13',
    'F14',
    'F15',
    'F16',
    'F17',
    'F18',
    'F19',
    'F20',
    'Soft1',
    'Soft2',
    'Soft3',
    'Soft4',
  ].includes(key);

export type Numbers = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export const isNumber = (key: string): key is Numbers =>
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key);

export type NumericKeypadKeys =
  | 'Decimal'
  | 'Key11'
  | 'Key12'
  | 'Multiply'
  | 'Add'
  | 'Clear'
  | 'Divide'
  | 'Subtract'
  | 'Separator'
  | Numbers;

export const isNumericKeypadKey = (key: string): key is NumericKeypadKeys =>
  isNumber(key) ||
  [
    'Decimal',
    'Key11',
    'Key12',
    'Multiply',
    'Add',
    'Clear',
    'Divide',
    'Subtract',
    'Separator',
  ].includes(key);

export type LatinKeys =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

export const isLatinKey = (key: string): key is LatinKeys =>
  [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ].includes(key);

export type NonAlphaNumericKeys =
  | '/'
  | '.'
  | ','
  | ']'
  | '['
  | ';'
  | '<'
  | '>'
  | '?'
  | '!'
  | '@'
  | '#'
  | '$'
  | '%'
  | '^'
  | '&'
  | '*'
  | '('
  | ')'
  | '-'
  | '='
  | '_'
  | '+'
  | '{'
  | '}'
  | '|'
  | ':'
  | '"'
  | '~'
  | '`';

export const isNonAlphaNumericKey = (key: string): key is NonAlphaNumericKeys =>
  [
    '/',
    '.',
    ',',
    ']',
    '[',
    ';',
    '<',
    '>',
    '?',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '-',
    '=',
    '_',
    '{',
    '}',
    ',',
    ':',
    '"',
    '~',
    '`',
  ].includes(key);

export type AnyKey = LiteralUnion<
  ModifierKeys | WhitespaceKeys | NavigationKeys | FunctionKeys | NumericKeypadKeys,
  string
>;

export const isAnyKey = (key: string): key is AnyKey =>
  isNonAlphaNumericKey(key) ||
  isNumber(key) ||
  isNumericKeypadKey(key) ||
  isLatinKey(key) ||
  isFunctionKey(key) ||
  isNavigationKey(key) ||
  isWhitespaceKeys(key) ||
  isModifierKey(key);

export type BasicKeyCombination = `${ModifierKeys | ''}${'+' | ''}${ModifierKeys | ''}${'+' | ''}${
  | LatinKeys
  | Numbers
  | WhitespaceKeys
  | NavigationKeys
  | NonAlphaNumericKeys}`;
