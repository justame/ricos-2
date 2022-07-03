import type {
  AmbientStyles,
  EditorCommands,
  EventData,
  EventPublisher,
  EventRegistrar,
  KeyboardShortcut,
  TranslationFunction,
} from 'ricos-types';
import { EditorKeyboardShortcut } from './editor-keyboard-shortcut';
import type { HotKeysProps, LocalizedDisplayData, Shortcut, Shortcuts } from './models/shortcuts';

export class ShortcutCollisionError extends Error {}

export class EditorKeyboardShortcuts implements Shortcuts {
  private shortcuts: Shortcut[] = [];

  private readonly publisher: EventPublisher<EventData>;

  constructor(events: EventRegistrar) {
    this.publisher = events.register('ricos.shortcuts.functionality.shortcutApplied');
  }

  private hasDuplicate(shortcut: Shortcut) {
    return this.shortcuts.find(s => s.equals(shortcut));
  }

  getHotKeysProps(group: string, commands: EditorCommands, t: TranslationFunction): HotKeysProps {
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
                this.publisher.publish(
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

  unregister(shortcut: KeyboardShortcut) {
    this.shortcuts = this.shortcuts.filter(s => !s.equals(EditorKeyboardShortcut.of(shortcut)));
  }

  filter(predicate: (shortcut: Shortcut) => boolean) {
    this.shortcuts = this.shortcuts.filter(predicate);
    return this;
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
