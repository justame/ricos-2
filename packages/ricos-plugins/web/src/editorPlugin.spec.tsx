import React from 'react';
import { EditorPlugin } from './editorPlugin';
import { PluginAddButton } from './pluginAddButton';
import type {
  EditorPlugin as EditorPluginType,
  ModalService,
  ShortcutDataProvider,
  ShortcutRegistrar,
  ToolbarType,
  PluginServices,
  EventRegistrar,
  EventSubscriptor,
  IUploadService,
  IUpdateService,
} from 'ricos-types';
import { identity } from 'fp-ts/function';

const modalService = {
  register: config => {},
  unregister: id => {},
} as ModalService;

const shortcuts: ShortcutRegistrar & ShortcutDataProvider = {
  register: () => {},
  unregister: () => {},
  getShortcutDisplayData: () => ({
    name: '',
    description: '',
    keyCombinationText: '',
    group: '',
  }),
} as ShortcutRegistrar & ShortcutDataProvider;

const events = {} as EventRegistrar & EventSubscriptor;

const uploadService = {} as IUploadService;

const updateService = {} as IUpdateService;

const services: PluginServices = {
  modalService,
  shortcuts,
  t: identity,
  events,
  uploadService,
  updateService,
};

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
      expect(buttons[0]).toBeInstanceOf(PluginAddButton);
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
