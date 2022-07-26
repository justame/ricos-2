import type {
  EditorCommands,
  KeyboardShortcut,
  PlatformDependent,
  TranslationFunction,
  Platform,
  LocalizedDisplayData,
} from 'ricos-types';
import type { Shortcut } from './models/shortcuts';
import { Keys } from './keys';

export class EditorKeyboardShortcut implements Shortcut {
  shortcut: KeyboardShortcut;

  keys: PlatformDependent<Keys>;

  static of(shortcut: KeyboardShortcut) {
    return new EditorKeyboardShortcut(shortcut);
  }

  private constructor(shortcut: KeyboardShortcut) {
    this.shortcut = shortcut;
    this.keys = {
      macOs: Keys.parse(shortcut.keys.macOs),
      windows: Keys.parse(shortcut.keys.windows),
    };
  }

  private getKeyCombinationText(platform: Platform): string {
    return this.keys[platform].toPlatformString(platform);
  }

  getKeyboardShortcut() {
    return this.shortcut;
  }

  getKeys(platform: Platform): Keys {
    return this.keys[platform];
  }

  getCommand(): (commands: EditorCommands) => void {
    return this.shortcut.command;
  }

  isEnabled(): boolean {
    return this.shortcut.enabled;
  }

  getName() {
    return this.shortcut.name;
  }

  getGroup(): string {
    return this.shortcut.group;
  }

  getDisplayData(t: TranslationFunction, platform: Platform): LocalizedDisplayData {
    return {
      name: t(this.shortcut.name),
      description: t(this.shortcut.description),
      group: t(this.shortcut.group),
      keyCombinationText: this.getKeyCombinationText(platform),
    };
  }

  configure(config: Partial<KeyboardShortcut>): EditorKeyboardShortcut {
    return new EditorKeyboardShortcut({ ...this.shortcut, ...config });
  }

  equals(shortcut: Shortcut): boolean {
    return (
      this.keys.macOs.equals(shortcut.getKeys('macOs')) &&
      this.keys.windows.equals(shortcut.getKeys('windows')) &&
      this.getGroup() === shortcut.getGroup()
    );
  }
}
