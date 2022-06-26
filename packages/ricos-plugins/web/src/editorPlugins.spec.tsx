import React from 'react';
import { EditorPlugins, PluginCollisionError } from './editorPlugins';
import { PluginAddButton } from './pluginAddButton';
import type { EditorPlugin as EditorPluginType, ToolbarType } from 'ricos-types';

describe('Editor Plugins', () => {
  const linkPreview: EditorPluginType = {
    type: 'ricos-link-preview',
    config: { exposeButtons: ['Instagram', 'Tiktok'] },
    addButtons: [
      {
        id: 'linkPreview',
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
          layout: 'popover',
        },
      },
      {
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
          layout: 'popover',
        },
      },
    ],
  };

  const emoji: EditorPluginType = {
    type: 'ricos-emoji',
    config: {},
    addButtons: [
      {
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
          layout: 'popover',
        },
      },
    ],
  };

  const divider: EditorPluginType = {
    type: 'ricos-divider',
    config: {},
    addButtons: [
      {
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
      },
    ],
  };

  it('should register/unregister plugin', () => {
    const registered = new EditorPlugins();
    registered.register(linkPreview);
    expect(registered.asArray().length).toEqual(1);
    registered.unregister(registered.asArray()[0]);
    expect(registered.asArray().length).toEqual(0);
  });

  it('should validate there is no duplication while register plugin', () => {
    const registered = new EditorPlugins();
    registered.register(linkPreview);
    try {
      registered.register(linkPreview);
    } catch (e) {
      expect(e).toBeInstanceOf(PluginCollisionError);
    }
  });

  it('should filter plugins', () => {
    const registered = new EditorPlugins();
    registered.register(linkPreview);
    registered.filter(plugin => !!plugin.getAddButtons());
    expect(registered.asArray().length).toEqual(1);
  });

  it('should produce add buttons', () => {
    const registered = new EditorPlugins();
    registered.register(linkPreview);
    registered.register(emoji);
    registered.register(divider);

    expect(registered.getAddButtons().asArray().length).toEqual(4);
  });
});
