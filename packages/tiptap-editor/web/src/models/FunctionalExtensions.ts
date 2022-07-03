import type { Extension } from '@tiptap/core';
import type { RicosEditorProps } from 'ricos-common';
import type { RicosServices } from 'ricos-types';
import type {
  ExtensionAggregate,
  FunctionalExtensionAggregate,
  IFunctionalExtension,
} from './domain-types';
import { IExtensionAggregate } from './IExtensionAggregate';
import { NodeHocDecorator } from './NodeHocDecorator';

export class FunctionalExtensions implements FunctionalExtensionAggregate {
  private extensions: IExtensionAggregate<IFunctionalExtension>;

  constructor(extensions: IFunctionalExtension[]) {
    this.extensions = new IExtensionAggregate(extensions);
  }

  getNodeHocComposer(
    extensions: ExtensionAggregate,
    ricosProps: RicosEditorProps,
    services: RicosServices
  ) {
    return new NodeHocDecorator(
      this.extensions.asArray().map(ex => ex.getNodeHocDescriptor(extensions, ricosProps, services))
    );
  }

  toTiptapExtensions(
    extensions: ExtensionAggregate,
    ricosProps: RicosEditorProps,
    services: RicosServices
  ) {
    return this.extensions
      .asArray()
      .map(e => e.toTiptapExtension(extensions, ricosProps, services)) as Extension[];
  }

  asArray() {
    return this.extensions.asArray();
  }
}
