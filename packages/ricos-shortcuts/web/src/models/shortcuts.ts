import type { KeyMap } from 'react-hotkeys';
import type {
  EditorCommands,
  EventPublisher,
  KeyboardShortcut,
  TranslationFunction,
  EventData,
  ShortcutRegistrar,
} from 'ricos-types';
import type { Keys } from '../keys';

export type LocalizedDisplayData = {
  name: KeyboardShortcut['name'];
  description: KeyboardShortcut['description'];
  keyCombinationText: KeyboardShortcut['keyCombinationText'];
  group: KeyboardShortcut['group'];
};

export type HotKeysProps = {
  keyMap: KeyMap;
  handlers: { [name: string]: (e: KeyboardEvent) => void };
  allowChanges: boolean;
};

/**
 * Represents a keyboard shortcut in Ricos Editor.
 * Admits key combination, command, relevant context, display data.
 *
 * @export
 * @interface Shortcut
 */
export interface Shortcut {
  /**
   * Parsed Keys
   *
   * @returns  {Keys}
   * @memberof Shortcut
   */
  getKeys(): Keys;
  /**
   * Command to run
   *
   * @returns  {KeyboardShortcut['command']}
   * @memberof Shortcut
   */
  getCommand(): KeyboardShortcut['command'];
  /**
   * Pre-localized name
   *
   * @returns  {KeyboardShortcut['name']}
   * @memberof Shortcut
   */
  getName(): KeyboardShortcut['name'];
  /**
   * Pre-localized group
   *
   * @returns  {KeyboardShortcut['group']}
   * @memberof Shortcut
   */
  getGroup(): KeyboardShortcut['group'];
  /**
   * Localized shortcut data for tooltips, help dialogs, etc
   *
   * @param {TranslationFunction} t
   * @returns  {LocalizedDisplayData}
   * @memberof Shortcut
   */
  getDisplayData(t: TranslationFunction): LocalizedDisplayData;
  /**
   * Enabled status
   *
   * @returns  {KeyboardShortcut['enabled']}
   * @memberof Shortcut
   */
  isEnabled(): KeyboardShortcut['enabled'];
  /**
   * KeyboardShortcut config
   *
   * @memberof Shortcut
   */
  getKeyboardShortcut: () => KeyboardShortcut;
  /**
   * Reconfigure Shortcut
   *
   * @param {KeyboardShortcut} config
   * @returns  {Shortcut}
   * @memberof Shortcut
   */
  configure(config: Partial<KeyboardShortcut>): Shortcut; // runtime configuration
  /**
   * Determines whether shortcut equals to another shortcut, based on keys and group
   *
   * @param {Shortcut} shortcut
   * @returns  {boolean}
   * @memberof Shortcut
   */
  equals(shortcut: Shortcut): boolean;
}

/**
 * Aggregate over Shortcut entity.
 * Responsible for shortcut validation.
 * Conforms to `react-hotkeys` lib API.
 *
 * @export
 * @interface Shortcuts
 */
export interface Shortcuts extends ShortcutRegistrar {
  /**
   * Filters shortcuts according to predicate
   *
   * @memberof Shortcuts
   */
  filter: (predicate: (shortcut: Shortcut) => boolean) => Shortcuts;
  /**
   * Gets shortcut array
   *
   * @memberof Shortcuts
   */
  asArray: () => Shortcut[];
  /**
   * Builds a map of shortcut display data, grouped by shortcut groups
   *
   * @memberof Shortcuts
   */
  getDisplayData: (t: TranslationFunction) => { [group: string]: LocalizedDisplayData[] };
  /**
   * Constructs `react-hotkeys` compatible data for given group
   *
   * @memberof Shortcuts
   */
  getHotKeysProps: (
    group: string,
    commands: EditorCommands,
    t: TranslationFunction
  ) => HotKeysProps;
}
