import React from 'react';
import type { EditorPlugin as EditorPluginType, ToolbarType } from 'ricos-types';
import { EditorPlugin } from './editorPlugin';
import type { PluginServices } from './editorPlugins';
import { RicosPluginAddButton } from './pluginAddButton';

const services = {
  modals: {
    register: jest.fn(),
    unregister: jest.fn(),
  },
} as unknown as PluginServices;

describe('Editor Plugin', () => {
  const plugin: EditorPluginType = {
    type: 'ricos-plugin',
    config: {},
    getAddButtons: () => [
      {
        id: 'ricos-plugin',
        icon: () => <div />,
        label: 'ricos-plugin',
        dataHook: 'ricos-plugin',
        tooltip: 'InsertButton_Tooltip',
        toolbars: ['SIDE'] as ToolbarType[],
        command: editorCommands => {
          return true;
        },
        menuConfig: {
          tags: 'plugin_search_tags',
          group: 'embed',
        },
        modal: {
          Component: () => <div />,
          id: 'ricos-plugin-modal',
        },
      },
    ],
  };

  const actual = EditorPlugin.of(plugin, services);
  actual.register();
  it('should create valid instance', () => {
    expect(actual).toBeInstanceOf(EditorPlugin);
    expect(actual.getType()).toEqual('ricos-plugin');
    expect(actual.getConfig()).toEqual({});
  });

  it('should produce valid add buttons', () => {
    const buttons = actual.getAddButtons();
    if (buttons) {
      expect(buttons[0]).toBeInstanceOf(RicosPluginAddButton);
    }
  });

  it('should compare plugins correctly', () => {
    const actual2 = EditorPlugin.of(
      {
        type: 'ricos-plugin2',
        config: {},
      },
      services
    );

    expect(actual2.equals(actual)).toBeFalsy();
    expect(actual2.equals(actual2)).toBeTruthy();
  });
});
