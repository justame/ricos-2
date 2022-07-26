import type {
  EditorCommands,
  EventData,
  EventPublisher,
  EventRegistrar,
  KeyboardShortcut,
  ModalService,
  Platform,
  TranslationFunction,
  LocalizedDisplayData,
} from 'ricos-types';
import { EditorKeyboardShortcut } from './editor-keyboard-shortcut';
import type { HotKeysProps, Shortcut, Shortcuts } from './models/shortcuts';
import { ShortcutsDialog } from './ShortcutsDialog';

export class ShortcutCollisionError extends Error {}

export class EditorKeyboardShortcuts implements Shortcuts {
  private shortcuts: Shortcut[] = [];

  private readonly publisher: EventPublisher<EventData>;

  constructor(events: EventRegistrar, modalService: ModalService) {
    this.publisher = events.register('ricos.shortcuts.functionality.shortcutApplied');
    modalService.register({
      Component: ShortcutsDialog,
      id: 'shortcuts-help',
    });
  }

  private hasDuplicate(shortcut: Shortcut) {
    return this.shortcuts.find(s => s.equals(shortcut));
  }

  getHotKeysProps(
    group: string,
    commands: EditorCommands,
    t: TranslationFunction,
    platform: Platform
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
                sequences: [shortcut.getKeys(platform).toString().toLowerCase()],
                ...shortcut.getDisplayData(t, platform),
              },
            },
            handlers: {
              ...handlers,
              [shortcut.getName()]: (e: KeyboardEvent) => {
                e.preventDefault();
                shortcut.getCommand()(commands);
                this.publisher.publish(
                  `🎹 keyboard shortcut ${shortcut.getName()} applied (${shortcut
                    .getKeys(platform)
                    .toPlatformString(platform)})`
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

  getShortcutDisplayData(
    name: string,
    t: TranslationFunction,
    platform: Platform
  ): LocalizedDisplayData {
    const shortcut = this.shortcuts.find(s => s.getName() === name);

    if (!shortcut) {
      return {
        name: '',
        description: '',
        keyCombinationText: '',
        group: '',
      };
    }

    return shortcut.getDisplayData(t, platform);
  }

  getDisplayData(
    t: TranslationFunction,
    platform: Platform
  ): { [group: string]: LocalizedDisplayData[] } {
    return this.shortcuts.reduce(
      (map, shortcut) => ({
        ...map,
        [shortcut.getGroup()]: [
          ...(map[shortcut.getGroup()] || []),
          shortcut.getDisplayData(t, platform),
        ],
      }),
      {} as { [group: string]: LocalizedDisplayData[] }
    );
  }
}
