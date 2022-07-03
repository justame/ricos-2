import { Extension } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/react';
import React from 'react';
import type {
  ExtensionProps,
  Group,
  NodeHocDescriptor,
  RicosExtension,
  RicosExtensionConfig,
} from 'ricos-tiptap-types';
import { isRicosFunctionalExtension } from 'ricos-tiptap-types';
import type { RicosServices } from 'ricos-types';
import type { ExtensionAggregate, IFunctionalExtension } from './domain-types';
import { DEFAULT_PRIORITY } from './domain-types';

const DEFAULT_HOC_DESCRTIPTOR: NodeHocDescriptor = {
  nodeTypes: [],
  priority: Number.POSITIVE_INFINITY,
  nodeHoc: () => () => <div />,
};

export class FunctionalExtension implements IFunctionalExtension {
  config: RicosExtensionConfig;

  priority: number;

  type = 'extension' as const;

  name: string;

  groups: Group[];

  private readonly ricosExtension: RicosExtension;

  private readonly settings: Record<string, unknown>;

  private readonly reconfigure: (
    config: RicosExtensionConfig,
    extensions: RicosExtension[],
    props: ExtensionProps,
    settings: Record<string, unknown>,
    services: RicosServices
  ) => RicosExtensionConfig;

  constructor(extension: RicosExtension, config?: RicosExtensionConfig) {
    if (!isRicosFunctionalExtension(extension)) {
      throw new TypeError('invalid argument');
    }
    const { addKeyboardShortcuts, ...rest } =
      config || extension.createExtensionConfig({ mergeAttributes });
    this.config = {
      ...rest,
      ...(extension.groups.includes('shortcuts-enabled') ? { addKeyboardShortcuts } : {}),
      type: 'extension',
    };
    this.priority = this.config.priority || DEFAULT_PRIORITY;
    this.name = this.config.name;
    this.groups = extension.groups || [];
    this.settings = extension.settings || {};
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
    return Extension.create(config);
  }

  getNodeHocDescriptor(
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
    return config.addNodeHoc?.() || DEFAULT_HOC_DESCRTIPTOR;
  }
}
