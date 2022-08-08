/* eslint-disable brace-style */
import type {
  EditorCommands,
  EventSource,
  KeyboardShortcut,
  LocalizedDisplayData,
  ModalService,
  Platform,
  PublisherProvider,
  TranslationFunction,
} from 'ricos-types';
import { EditorKeyboardShortcut } from './editor-keyboard-shortcut';
import type { HotKeysProps, Shortcut, Shortcuts } from './models/shortcuts';
import { ShortcutsDialog } from './ShortcutsDialog';

export class ShortcutCollisionError extends Error {}

const TOPICS: ['ricos.shortcuts.functionality.applied'] = ['ricos.shortcuts.functionality.applied'];

export class EditorKeyboardShortcuts
  implements Shortcuts, EventSource<['ricos.shortcuts.functionality.applied']>
{
  private shortcuts: Shortcut[] = [];

  isDebugMode = false;

  readonly topicsToPublish = TOPICS;

  publishers!: PublisherProvider<['ricos.shortcuts.functionality.applied']>;

  constructor(
    modalService: ModalService,
    config: { isDebugMode: boolean } = { isDebugMode: false }
  ) {
    modalService.register({
      Component: ShortcutsDialog,
      id: 'shortcuts-help',
    });
    this.isDebugMode = config.isDebugMode;
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
    const publisher = this.publishers.byTopic('ricos.shortcuts.functionality.applied');
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
                publisher.publish({ shortcutName: shortcut.getName() });
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
