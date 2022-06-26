import { identity } from 'fp-ts/function';
import type {
  BasicKeyCombination,
  EditorCommands,
  EventData,
  EventPublisher,
  KeyboardShortcut,
} from 'ricos-types';
import { RICOS_DIVIDER_TYPE } from 'wix-rich-content-common';
import { EditorKeyboardShortcut } from './editor-keyboard-shortcut';
import { EditorKeyboardShortcuts } from './editor-keyboard-shortcuts';

describe('Editor Keyboard Shortcuts', () => {
  const bold = {
    name: 'Bold',
    description: 'Toggles bold style of selected text',
    keys: 'Shift+Meta+B' as BasicKeyCombination,
    command(editorCommands: EditorCommands) {
      editorCommands.toggleInlineStyle('bold');
    },
    group: 'formatting' as const,
    keyCombinationText: 'Cmd+B',
    enabled: true,
  };
  const italic = {
    name: 'Italic',
    description: 'Toggles italic style of selected text',
    keys: 'Meta+I' as BasicKeyCombination,
    command(editorCommands: EditorCommands) {
      editorCommands.toggleInlineStyle('italic');
    },
    group: 'formatting' as const,
    keyCombinationText: 'Cmd+I',
    enabled: true,
  };

  const addDivider = {
    name: 'AddDivider',
    description: 'Adds Divider',
    keys: 'Meta+B' as BasicKeyCombination,
    command(editorCommands: EditorCommands) {
      editorCommands.insertBlock(RICOS_DIVIDER_TYPE);
    },
    group: 'add-plugin' as const,
    keyCombinationText: 'Cmd+B',
    enabled: true,
  };

  it('should register/unregister shortcut', () => {
    const registered = new EditorKeyboardShortcuts();
    registered.register(bold);
    expect(registered.asArray().length).toEqual(1);
    registered.unregister(registered.asArray()[0]);
    expect(registered.asArray().length).toEqual(0);
  });

  it('should filter shortcuts', () => {
    const registered = new EditorKeyboardShortcuts();
    registered.register(bold);
    const filtered = registered.filter(shortcut => shortcut.getGroup() === 'add-plugin');
    expect(filtered.asArray().length).toEqual(0);
  });

  it('should produce grouped display data', () => {
    const registered = new EditorKeyboardShortcuts();
    registered.register(bold);
    registered.register(italic);
    registered.register(addDivider);

    const expected = {
      formatting: [
        {
          name: 'Bold',
          description: 'Toggles bold style of selected text',
          keyCombinationText: 'Cmd+B',
          group: 'formatting',
        },
        {
          name: 'Italic',
          description: 'Toggles italic style of selected text',
          keyCombinationText: 'Cmd+I',
          group: 'formatting',
        },
      ],
      'add-plugin': [
        {
          name: 'AddDivider',
          description: 'Adds Divider',
          keyCombinationText: 'Cmd+B',
          group: 'add-plugin',
        },
      ],
    };

    expect(registered.getDisplayData(identity)).toEqual(expected);
  });

  it('should produce HotKeys props for group', () => {
    const publisher: EventPublisher<EventData> = {
      publish: jest.fn(),
      publishSync: jest.fn(),
      topic: 'ricos.shortcuts.test.mock',
    };
    const commands = {
      toggleInlineStyle: identity,
      insertBlock: identity,
    };

    const actual = new EditorKeyboardShortcuts();
    actual.register(bold);
    actual.register(italic);
    actual.register(addDivider);
    const { keyMap, handlers } = actual.getHotKeysProps(
      'formatting',
      commands as EditorCommands,
      identity,
      publisher
    );

    expect(keyMap).toEqual({
      Bold: {
        description: 'Toggles bold style of selected text',
        group: 'formatting',
        keyCombinationText: 'Cmd+B',
        name: 'Bold',
        sequences: ['meta+shift+b'],
      },
      Italic: {
        description: 'Toggles italic style of selected text',
        group: 'formatting',
        keyCombinationText: 'Cmd+I',
        name: 'Italic',
        sequences: ['meta+i'],
      },
    });

    expect(typeof handlers.Bold).toEqual('function');
    expect(typeof handlers.Italic).toEqual('function');
    expect(typeof handlers.AddDivider).toEqual('undefined');
  });
});
