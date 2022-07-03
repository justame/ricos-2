/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { AddButton, ToolbarType } from 'ricos-types';
import {
  PluginAddButton,
  PluginAddButtons,
  PluginAddButtonCollisionError,
} from './pluginAddButton';
import { alwaysVisibleResolver } from 'wix-rich-content-toolbars-v3';

const instagram: AddButton = {
  id: 'instagram',
  icon: () => <div />,
  label: 'Instagram',
  tooltip: 'insert instagram embed',
  toolbars: ['SIDE'] as ToolbarType[],
  command: editorCommands => {
    return true;
  },
  menuConfig: {
    tags: 'instagram social embed',
    group: 'embed',
  },
  modal: {
    Component: () => <div />,
    id: 'link-preview-modal',
  },
};

const tiktok: AddButton = {
  id: 'tiktok',
  icon: () => <div />,
  label: 'Tiktok',
  tooltip: 'insert tiktok embed',
  toolbars: ['SIDE'] as ToolbarType[],
  command: editorCommands => {
    return true;
  },
  menuConfig: {
    tags: 'tiktok social embed',
    group: 'embed',
  },
  modal: {
    Component: () => <div />,
    id: 'link-preview-modal',
  },
};

const emoji: AddButton = {
  id: 'emoji',
  icon: () => <div />,
  label: 'Emoji',
  tooltip: 'insert emoji',
  toolbars: ['SIDE'] as ToolbarType[],
  command: editorCommands => {
    editorCommands.insertText(`:)`);
    return true;
  },
  menuConfig: {
    tags: 'emoji',
  },
  modal: {
    Component: () => <div />,
    id: 'emoji-modal',
  },
};

const divider: AddButton = {
  id: 'divider',
  icon: () => <div />,
  label: 'Divider',
  tooltip: 'insert divider',
  toolbars: ['SIDE'] as ToolbarType[],
  command: editorCommands => {
    editorCommands.insertBlock('ricos-divider');
    return true;
  },
  menuConfig: {
    tags: 'divider line',
  },
};

describe('Add button', () => {
  const actual = PluginAddButton.of(emoji, {} as any);
  const { label, tooltip } = actual.getButton();

  it('should create valid instance', () => {
    expect(actual).toBeInstanceOf(PluginAddButton);
    expect(label).toEqual('Emoji');
    expect(tooltip).toEqual('insert emoji');
    expect(actual.getTags()).toEqual('emoji');
  });

  it('should compare buttons correctly', () => {
    const button = PluginAddButton.of(divider, {} as any);
    expect(button.equals(actual)).toBeFalsy();
    expect(button.equals(button)).toBeTruthy();
  });

  it('should create toolbar item config correctly', () => {
    const button = PluginAddButton.of(divider, {} as any);
    const { tooltip, icon, id } = button.getButton();

    const expected = {
      id,
      type: 'toggle',
      presentation: {
        tooltip,
        icon,
      },
      attributes: {
        visible: alwaysVisibleResolver,
      },
      commands: {
        click:
          ({ editorCommands }) =>
          () => {
            button.getButton().command(editorCommands);
          },
      },
    };
    expect(button.toToolbarItemConfig().toString()).toEqual(expected.toString());
  });
});

describe('Add buttons', () => {
  it('should register/unregister plugin add button', () => {
    const registered = new PluginAddButtons([], {} as any);
    registered.register(instagram);
    expect(registered.asArray().length).toEqual(1);
    registered.unregister(instagram);
    expect(registered.asArray().length).toEqual(0);
  });

  it('should validate there is no duplication while register plugin add button', () => {
    const registered = new PluginAddButtons([], {} as any);
    registered.register(instagram);
    try {
      registered.register(instagram);
    } catch (e) {
      expect(e).toBeInstanceOf(PluginAddButtonCollisionError);
    }
  });

  it('should filter buttons by group', () => {
    const registered = new PluginAddButtons([], {} as any);
    registered.register(instagram);
    registered.register(tiktok);
    registered.register(divider);
    registered.register(emoji);

    const filtered = registered.byGroup('embed');
    expect(filtered.asArray().length).toEqual(2);
  });
});
