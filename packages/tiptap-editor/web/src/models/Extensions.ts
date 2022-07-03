import { Extension } from '@tiptap/core';
import { not } from 'fp-ts/Predicate';
import { and, firstRight } from 'ricos-content';
import type { Group, RicosExtension, RicosNodeExtension, ExtensionProps } from 'ricos-tiptap-types';
import {
  isRicosFunctionalExtension,
  isRicosMarkExtension,
  isRicosNodeExtension,
} from 'ricos-tiptap-types';
import type { RicosServices } from 'ricos-types';
import type {
  ExtensionAggregate,
  IExtension,
  IFunctionalExtension,
  IHtmlNodeExtension,
  IMarkExtension,
  IReactNodeExtension,
} from './domain-types';
import { FunctionalExtension } from './FunctionalExtension';
import { FunctionalExtensions } from './FunctionalExtensions';
import { IExtensionAggregate } from './IExtensionAggregate';
import { MarkExtension } from './MarkExtension';
import { MarkExtensions } from './MarkExtensions';
import { HtmlNodeExtension, ReactNodeExtension } from './NodeExtension';
import { HtmlNodeExtensions, ReactNodeExtensions } from './NodeExtensions';

const hasReactGroup = (ext: RicosNodeExtension): boolean => ext.groups.includes('react');

// TODO: default extension should be FunctionalExtension with empty functionality
const defaultIExtension = {
  toTiptapExtension: Extension.create,
};

const toIExtension = (ext: RicosExtension): IExtension =>
  firstRight(ext, defaultIExtension as unknown as IExtension, [
    [and([isRicosNodeExtension, hasReactGroup]), () => new ReactNodeExtension(ext)],
    [and([isRicosNodeExtension, not(hasReactGroup)]), () => new HtmlNodeExtension(ext)],
    [isRicosMarkExtension, () => new MarkExtension(ext)],
    [isRicosFunctionalExtension, () => new FunctionalExtension(ext)],
  ]);

const validate = (extensions: IExtension[]) => {
  const names = extensions.map(e => e.name);
  const duplicateNames = names
    .map(name => ({ name, duplicate: names.indexOf(name) !== names.lastIndexOf(name) }))
    .filter(({ duplicate }) => !!duplicate)
    .map(({ name }) => name);
  if (duplicateNames.length > 0) {
    throw new NameCollisionError(`Extension name collision: ${duplicateNames.join(' ,')}`);
  }
};

class NameCollisionError extends Error {}

/**
 * Extensions is an aggregate over Extension entities.
 * It provides filtering and sorting functionalities which are relevant only in context of multiple Extension instances.
 * The specific Extensions subtypes are NodeExtensions, MarkExtensions and FunctionalExtensions.
 * They rely on filtering and constructed internally by the Extensions.
 */
export class Extensions implements ExtensionAggregate {
  private extensions: IExtensionAggregate<IExtension>;

  private readonly ricosProps: ExtensionProps;

  private readonly services: RicosServices;

  private constructor(extensions: IExtension[], props: ExtensionProps, services: RicosServices) {
    this.extensions = new IExtensionAggregate<IExtension>(extensions);
    this.ricosProps = props;
    this.services = services;
  }

  static of(extensions: RicosExtension[], props: ExtensionProps, services: RicosServices) {
    const iExtensions = extensions.map(toIExtension);
    validate(iExtensions);
    return new Extensions(iExtensions, props, services);
  }

  getRicosExtensions() {
    return this.extensions.asArray().map(ext => ext.getRicosExtension());
  }

  getFunctionalExtensions() {
    return new FunctionalExtensions(
      this.extensions.filter(ext => ext.type === 'extension').asArray() as IFunctionalExtension[]
    );
  }

  getReactNodeExtensions() {
    return new ReactNodeExtensions(
      this.extensions
        .filter(ext => ext.type === 'node' && ext.groups.includes('react'))
        .asArray() as IReactNodeExtension[]
    );
  }

  getHtmlNodeExtensions() {
    return new HtmlNodeExtensions(
      this.extensions
        .filter(ext => ext.type === 'node' && !ext.groups.includes('react'))
        .asArray() as IHtmlNodeExtension[]
    );
  }

  getMarkExtensions() {
    return new MarkExtensions(
      this.extensions.filter(ext => ext.type === 'mark').asArray() as IMarkExtension[]
    );
  }

  getDecoratedNodeExtensions() {
    const hocComposer = this.getFunctionalExtensions().getNodeHocComposer(
      this,
      this.ricosProps,
      this.services
    );
    return this.getReactNodeExtensions().getDecoratedNodeExtensions(hocComposer);
  }

  getTiptapExtensions() {
    const reactNodes = this.getDecoratedNodeExtensions().toTiptapExtensions(
      this,
      this.ricosProps,
      this.services
    );
    const htmlNodes = this.getHtmlNodeExtensions().toTiptapExtensions(
      this,
      this.ricosProps,
      this.services
    );
    const marks = this.getMarkExtensions().toTiptapExtensions(this, this.ricosProps, this.services);
    const extensions = this.getFunctionalExtensions().toTiptapExtensions(
      this,
      this.ricosProps,
      this.services
    );
    return [...extensions, ...marks, ...reactNodes, ...htmlNodes];
  }

  asArray() {
    return this.extensions.asArray();
  }

  concat(extensions: RicosExtension[]): Extensions {
    const iExtensions = extensions.map(toIExtension);
    validate(iExtensions);
    return new Extensions(
      this.extensions.asArray().concat(iExtensions),
      this.ricosProps,
      this.services
    );
  }

  byGroup(group: Group) {
    return new Extensions(
      this.extensions.filter(ext => ext.groups.includes(group)).asArray(),
      this.ricosProps,
      this.services
    );
  }
}
