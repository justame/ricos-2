import { identity } from 'fp-ts/function';
import type { EditorCommands, EventRegistrar, KeyboardShortcut, ModalService } from 'ricos-types';
import { RICOS_DIVIDER_TYPE } from 'wix-rich-content-common';
import { EditorKeyboardShortcuts } from './editor-keyboard-shortcuts';

describe('Editor Keyboard Shortcuts', () => {
  const events: EventRegistrar = {
    getAllTopics: () => [],
    register: () => ({
      publish: () => false,
      publishSync: () => false,
      publishOnce: () => false,
      topic: 'ricos.shortcuts.test.EditorKeyboardShortcuts',
    }),
  };

  const bold: KeyboardShortcut = {
    name: 'Bold',
    description: 'Toggles bold style of selected text',
    keys: { macOs: 'Meta+B', windows: 'Ctrl+B' },
    command(editorCommands: EditorCommands) {
      editorCommands.toggleInlineStyle('bold');
    },
    group: 'formatting' as const,
    enabled: true,
  };
  const italic: KeyboardShortcut = {
    name: 'Italic',
    description: 'Toggles italic style of selected text',
    keys: { macOs: 'Meta+I', windows: 'Ctrl+I' },
    command(editorCommands: EditorCommands) {
      editorCommands.toggleInlineStyle('italic');
    },
    group: 'formatting' as const,
    enabled: true,
  };

  const addDivider: KeyboardShortcut = {
    name: 'AddDivider',
    description: 'Adds Divider',
    keys: { macOs: 'Meta+B', windows: 'Ctrl+B' },
    command(editorCommands: EditorCommands) {
      editorCommands.insertBlock(RICOS_DIVIDER_TYPE);
    },
    group: 'add-plugin' as const,
    enabled: true,
  };

  const modalService: ModalService = {
    register: jest.fn(),
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isModalOpen: jest.fn(),
    unregister: jest.fn(),
    getOpenModals: jest.fn(),
    onModalOpened: jest.fn(),
    onModalClosed: jest.fn(),
    destroy(): void {},
    getModal: () => undefined,
  };

  it('should register/unregister shortcut', () => {
    const registered = new EditorKeyboardShortcuts(events, modalService);
    registered.register(bold);
    expect(registered.asArray().length).toEqual(1);
    registered.unregister(registered.asArray()[0].getKeyboardShortcut());
    expect(registered.asArray().length).toEqual(0);
  });

  it('should filter shortcuts', () => {
    const registered = new EditorKeyboardShortcuts(events, modalService);
    registered.register(bold);
    const filtered = registered.filter(shortcut => shortcut.getGroup() === 'add-plugin');
    expect(filtered.asArray().length).toEqual(0);
  });

  it('should produce grouped display data', () => {
    const registered = new EditorKeyboardShortcuts(events, modalService);
    registered.register(bold);
    registered.register(italic);
    registered.register(addDivider);

    const expected = {
      formatting: [
        {
          name: 'Bold',
          description: 'Toggles bold style of selected text',
          keyCombinationText: '⌘B',
          group: 'formatting',
        },
        {
          name: 'Italic',
          description: 'Toggles italic style of selected text',
          keyCombinationText: '⌘I',
          group: 'formatting',
        },
      ],
      'add-plugin': [
        {
          name: 'AddDivider',
          description: 'Adds Divider',
          keyCombinationText: '⌘B',
          group: 'add-plugin',
        },
      ],
    };

    expect(registered.getDisplayData(identity, 'macOs')).toEqual(expected);
  });

  it('should produce HotKeys props for group', () => {
    const commands = {
      toggleInlineStyle: identity,
      insertBlock: identity,
    };

    const actual = new EditorKeyboardShortcuts(events, modalService);
    actual.register(bold);
    actual.register(italic);
    actual.register(addDivider);
    const { keyMap, handlers } = actual.getHotKeysProps(
      'formatting',
      commands as EditorCommands,
      identity,
      'macOs'
    );

    expect(keyMap).toEqual({
      Bold: {
        description: 'Toggles bold style of selected text',
        group: 'formatting',
        keyCombinationText: '⌘B',
        name: 'Bold',
        sequences: ['meta+b'],
      },
      Italic: {
        description: 'Toggles italic style of selected text',
        group: 'formatting',
        keyCombinationText: '⌘I',
        name: 'Italic',
        sequences: ['meta+i'],
      },
    });

    expect(typeof handlers.Bold).toEqual('function');
    expect(typeof handlers.Italic).toEqual('function');
    expect(typeof handlers.AddDivider).toEqual('undefined');
  });
});
