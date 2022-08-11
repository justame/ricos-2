import type { TranslationFunction } from 'i18next';
import type { EditorCommands } from './editorCommandsType';
import type { BasicKeyCombination } from './key-types';
import type { ModalService } from './modalTypes';

export type PlatformDependent<T> = {
  macOs: T;
  windows: T;
};

export type Platform = 'macOs' | 'windows';

export type LocalizedDisplayData = {
  name: KeyboardShortcut['name'];
  description: KeyboardShortcut['description'];
  keyCombinationText: string;
  group: KeyboardShortcut['group'];
};

export type PlatformDependentKeys = PlatformDependent<BasicKeyCombination>;

/**
 * Keyboard shortcut configuration
 *
 * @export
 * @interface KeyboardShortcut
 */
export interface KeyboardShortcut {
  /**
   * Shortcut identifier, used as localized display data
   *
   * @type {string}
   * @memberof KeyboardShortcut
   */
  name: string;
  /**
   * Shortcut description, used as localized display data
   *
   * @type {string}
   * @memberof KeyboardShortcut
   */
  description: string;
  /**
   * Shortcut group (context), used both as grouping key and localized display data
   *
   * @type {string}
   * @memberof KeyboardShortcut
   */
  group: string;
  /**
   * The shortcut keys like Control+B
   * Limited up to 2 modifiers and single Latin/number/some special character key
   *
   * The key names based on standard Web KeyboardEvent.key values:
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
   *
   * @type {BasicKeyCombination}
   * @memberof KeyboardShortcut
   */
  keys: PlatformDependentKeys;
  /**
   * Command for execution
   *
   * @memberof KeyboardShortcut
   */
  command: (commands: EditorCommands, modalService: ModalService) => void; // TODO: define return value type
  /**
   * Enables shortcut
   *
   * @type {boolean}
   * @memberof KeyboardShortcut
   */
  enabled: boolean;
}

export interface ShortcutRegistrar {
  /**
   * Registers shortcut, validates it has no conflicts.
   *
   * @memberof ShortcutRegistrar
   */
  register: (shortcut: KeyboardShortcut) => void;

  /**
   * Unregisters shortcut
   *
   * @memberof ShortcutRegistrar
   */
  unregister: (shortcut: KeyboardShortcut) => void;
}

export interface ShortcutDataProvider {
  /**
   * Provides shortcut display data by given shortcut name for current locale and platform
   *
   * @param {KeyboardShortcut['name']} name
   * @param {TranslationFunction} t
   * @param {Platform} platform
   * @returns  {LocalizedDisplayData}
   * @memberof ShortcutDataProvider
   */
  getShortcutDisplayData(
    name: KeyboardShortcut['name'],
    t: TranslationFunction,
    platform: Platform
  ): LocalizedDisplayData;
}
