import { identity } from 'fp-ts/function';
import type { EditorCommands, KeyboardShortcut } from 'ricos-types';
import { EditorKeyboardShortcut } from './editor-keyboard-shortcut';

describe('Editor Keyboard Shortcut', () => {
  const shortcut: KeyboardShortcut = {
    name: 'Bold',
    description: 'Toggles bold style of selected text',
    keys: { macOs: 'Meta+B', windows: 'Ctrl+B' },
    command(editorCommands: EditorCommands) {
      editorCommands.toggleInlineStyle('bold');
    },
    group: 'formatting',
    enabled: true,
  };

  const actual = EditorKeyboardShortcut.of(shortcut);
  it('should create valid instance', () => {
    expect(actual).toBeInstanceOf(EditorKeyboardShortcut);
    expect(actual.getKeys('macOs').toString()).toEqual('Meta+B');
    expect(actual.getGroup()).toEqual('formatting');
    expect(actual.getName()).toEqual('Bold');
    expect(actual.getKeyboardShortcut()).toEqual(shortcut);
    expect(actual.isEnabled()).toBeTruthy();
  });

  it('should produce valid display data', () => {});
  expect(actual.getDisplayData(identity, 'macOs')).toEqual({
    name: 'Bold',
    description: 'Toggles bold style of selected text',
    keyCombinationText: '⌘B',
    group: 'formatting',
  });

  it('should allow reconfiguration', () => {
    const reconfigured = actual.configure({
      name: 'Underline',
      description: 'Adds underline style',
      keys: { macOs: 'Meta+Alt+U', windows: 'Meta+Alt+U' },
      enabled: false,
    });
    expect(reconfigured.isEnabled()).toBeFalsy();
    expect(reconfigured.getDisplayData(identity, 'macOs')).toEqual({
      name: 'Underline',
      description: 'Adds underline style',
      group: 'formatting',
      keyCombinationText: '⌘⌥U',
    });
    expect(reconfigured.getDisplayData(identity, 'windows').keyCombinationText).toEqual(
      'Win+Alt+U'
    );
  });

  it('should compare shortcuts correctly', () => {
    const reconfigured = actual.configure({
      group: 'add-plugin',
    });
    expect(reconfigured.equals(actual)).toBeFalsy();
    expect(reconfigured.equals(reconfigured)).toBeTruthy();
  });
});
