import type { Node } from '@tiptap/core';
import type { RicosEditorProps } from 'ricos-common';
import type { TiptapAdapterServices } from '../initializeTiptapAdapter';
import type {
  DecoratedNodeExtension,
  ConvertableNodeExtensionAggregate,
  IReactNodeExtension,
  ReactNodeExtensionAggregate,
  NodeHocComposer,
  IHtmlNodeExtension,
  ExtensionAggregate,
} from './domain-types';
import { IExtensionAggregate } from './IExtensionAggregate';

export class ReactNodeExtensions implements ReactNodeExtensionAggregate {
  private extensions: IExtensionAggregate<IReactNodeExtension>;

  constructor(extensions: IReactNodeExtension[]) {
    this.extensions = new IExtensionAggregate(extensions);
  }

  getDecoratedNodeExtensions(hocComposer: NodeHocComposer) {
    return new DecoratedNodeExtensions(
      this.extensions.asArray().map(ex => hocComposer.decorate(ex))
    );
  }

  asArray() {
    return this.extensions.asArray();
  }
}

export class DecoratedNodeExtensions implements ConvertableNodeExtensionAggregate {
  private extensions: IExtensionAggregate<DecoratedNodeExtension>;

  constructor(extensions: DecoratedNodeExtension[]) {
    this.extensions = new IExtensionAggregate(extensions);
  }

  toTiptapExtensions(
    extensions: ExtensionAggregate,
    ricosProps: RicosEditorProps,
    services: TiptapAdapterServices
  ) {
    return this.extensions
      .asArray()
      .map(e => e.toTiptapExtension(extensions, ricosProps, services)) as Node[];
  }
}

export class HtmlNodeExtensions implements ConvertableNodeExtensionAggregate {
  private extensions: IExtensionAggregate<IHtmlNodeExtension>;

  constructor(extensions: IHtmlNodeExtension[]) {
    this.extensions = new IExtensionAggregate(extensions);
  }

  asArray() {
    return this.extensions.asArray();
  }

  toTiptapExtensions(
    extensions: ExtensionAggregate,
    ricosProps: RicosEditorProps,
    services: TiptapAdapterServices
  ) {
    return this.extensions
      .asArray()
      .map(e => e.toTiptapExtension(extensions, ricosProps, services)) as Node[];
  }
}
