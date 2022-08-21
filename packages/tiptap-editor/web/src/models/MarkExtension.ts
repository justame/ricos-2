import {
  isMarkActive,
  Mark,
  markInputRule,
  markPasteRule,
  textblockTypeInputRule,
} from '@tiptap/core';
import type { MarkConfig } from '@tiptap/react';
import { mergeAttributes } from '@tiptap/react';
import { Plugin, PluginKey } from 'prosemirror-state';
import type { ExtensionProps, RicosExtension, RicosServices } from 'ricos-types';
import { isRicosMarkExtension } from 'ricos-types';
import type { ExtensionAggregate, IMarkExtension } from './domain-types';
import { DEFAULT_PRIORITY } from './domain-types';

export class MarkExtension implements IMarkExtension {
  config: MarkConfig;

  priority: number;

  type = 'mark' as const;

  name: string;

  groups: RicosExtension['groups'];

  private readonly settings: Record<string, unknown>;

  private readonly reconfigure: (
    config: MarkConfig,
    extensions: RicosExtension[],
    ricosProps: ExtensionProps,
    settings: Record<string, unknown>,
    services: RicosServices
  ) => MarkConfig;

  private readonly ricosExtension: RicosExtension;

  constructor(extension: RicosExtension, config?: MarkConfig) {
    if (!isRicosMarkExtension(extension)) {
      throw new TypeError('invalid argument');
    }
    this.groups = extension.groups || [];
    this.settings = extension.settings || {};
    const { addKeyboardShortcuts, ...rest } =
      config ||
      extension.createExtensionConfig({
        isMarkActive,
        textblockTypeInputRule,
        mergeAttributes,
        markInputRule,
        markPasteRule,
        Plugin,
        PluginKey,
      });
    this.config = {
      ...rest,
      ...(extension.groups.includes('shortcuts-enabled') ? { addKeyboardShortcuts } : {}),
      type: 'mark',
    };
    this.priority = this.config.priority || DEFAULT_PRIORITY;
    this.name = this.config.name;
    this.ricosExtension = extension;
    this.reconfigure = extension.reconfigure || (() => this.config);
  }

  getRicosExtension() {
    return this.ricosExtension;
  }

  toTiptapExtension(
    extensions: ExtensionAggregate,
    ricosProps: ExtensionProps,
    services: RicosServices
  ) {
    const config = this.reconfigure(
      this.config,
      extensions.getRicosExtensions(),
      ricosProps,
      this.settings,
      services
    );
    return Mark.create(config);
  }
}
