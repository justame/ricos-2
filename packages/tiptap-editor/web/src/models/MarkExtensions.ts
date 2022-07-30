import type { Mark } from '@tiptap/core';
import type { RicosEditorProps } from 'ricos-common';
import type { TiptapAdapterServices } from '../initializeTiptapAdapter';
import type { ExtensionAggregate, IMarkExtension, MarkExtensionAggregate } from './domain-types';
import { IExtensionAggregate } from './IExtensionAggregate';

export class MarkExtensions implements MarkExtensionAggregate {
  private extensions: IExtensionAggregate<IMarkExtension>;

  constructor(extensions: IMarkExtension[]) {
    this.extensions = new IExtensionAggregate(extensions);
  }

  toTiptapExtensions(
    extensions: ExtensionAggregate,
    ricosProps: RicosEditorProps,
    services: TiptapAdapterServices
  ) {
    return this.extensions
      .asArray()
      .map(e => e.toTiptapExtension(extensions, ricosProps, services)) as Mark[];
  }

  asArray() {
    return this.extensions.asArray();
  }
}
