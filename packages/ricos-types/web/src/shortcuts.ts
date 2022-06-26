import type { EditorCommands } from './editorCommandsType';
import type { BasicKeyCombination } from './key-types';

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
  keys: BasicKeyCombination;
  /**
   * Command for execution
   *
   * @memberof KeyboardShortcut
   */
  command: (commands: EditorCommands) => void; // TODO: define return value type
  /**
   * Textual representation of key combination like 'Ctrl+B' or '⌘ B' (optional)
   *
   * @type {string}
   * @memberof KeyboardShortcut
   */
  keyCombinationText?: string;
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
