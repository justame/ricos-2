import type {
  EditorCommands,
  EventData,
  EventPublisher,
  KeyboardShortcut,
  TranslationFunction,
} from 'ricos-types';
import type { HotKeysProps, LocalizedDisplayData, Shortcut, Shortcuts } from './models/shortcuts';
import { EditorKeyboardShortcut } from './editor-keyboard-shortcut';

export class ShortcutCollisionError extends Error {}

export class EditorKeyboardShortcuts implements Shortcuts {
  private shortcuts: Shortcut[];

  constructor(shortcuts: Shortcut[] = []) {
    this.shortcuts = shortcuts;
  }

  private hasDuplicate(shortcut: Shortcut) {
    return this.shortcuts.find(s => s.equals(shortcut));
  }

  getHotKeysProps(
    group: string,
    commands: EditorCommands,
    t: TranslationFunction,
    publisher: EventPublisher<EventData>
  ): HotKeysProps {
    return this.shortcuts
      .filter(s => s.getGroup() === group || s.getGroup() === 'global')
      .reduce(
        ({ keyMap, handlers }, shortcut) => {
          return {
            allowChanges: false,
            keyMap: {
              ...keyMap,
              [shortcut.getName()]: {
                sequences: [shortcut.getKeys().toString().toLowerCase()],
                ...shortcut.getDisplayData(t),
              },
            },
            handlers: {
              ...handlers,
              [shortcut.getName()]: (e: KeyboardEvent) => {
                e.preventDefault();
                shortcut.getCommand()(commands);
                publisher.publish(
                  `🎹 keyboard shortcut ${shortcut.getName()} applied (${shortcut
                    .getKeys()
                    .toString()})`
                );
              },
            },
          };
        },
        { keyMap: {}, handlers: {}, allowChanges: false }
      );
  }

  register(shortcut: KeyboardShortcut) {
    const candidate = EditorKeyboardShortcut.of(shortcut);

    // TODO: validate vs browser built-in shortcuts
    const duplicate = this.hasDuplicate(candidate);
    if (duplicate) {
      throw new ShortcutCollisionError(
        `the shortcut ${candidate.getName()} conflicts with ${duplicate.getName()}`
      );
    }

    this.shortcuts.push(candidate);
  }

  unregister(shortcut: Shortcut) {
    this.shortcuts = this.shortcuts.filter(s => !s.equals(shortcut));
  }

  filter(predicate: (shortcut: Shortcut) => boolean) {
    return new EditorKeyboardShortcuts(this.shortcuts.filter(predicate));
  }

  asArray() {
    return this.shortcuts;
  }

  getDisplayData(t: TranslationFunction) {
    return this.shortcuts.reduce(
      (map, shortcut) => ({
        ...map,
        [shortcut.getGroup()]: [...(map[shortcut.getGroup()] || []), shortcut.getDisplayData(t)],
      }),
      {} as { [group: string]: LocalizedDisplayData[] }
    );
  }
}
