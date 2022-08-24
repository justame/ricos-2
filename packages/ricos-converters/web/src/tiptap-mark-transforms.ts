import type { Decoration } from 'ricos-schema';
import type { Transform, Transforms } from './models/converter';
import { getUnsupportedMarkFromTiptap, getUnsupportedDecorationToTiptap } from './mark-converters';
import type { TiptapMarkConverter, TiptapMark } from './types';

class ToTiptapMarkTransforms implements Transforms<Decoration, TiptapMark> {
  private readonly transforms: Transform<Decoration, TiptapMark>[];

  constructor(transforms: Transform<Decoration, TiptapMark>[]) {
    this.transforms = transforms;
  }

  byType(decoration: Decoration): Transform<Decoration, TiptapMark> {
    return (
      this.transforms.find(tr => tr.types.includes(decoration.type)) ||
      getUnsupportedDecorationToTiptap(decoration)
    );
  }
}

class FromTiptapMarkTransforms implements Transforms<TiptapMark, Decoration> {
  private readonly transforms: Transform<TiptapMark, Decoration>[];

  constructor(transforms: Transform<TiptapMark, Decoration>[]) {
    this.transforms = transforms;
  }

  byType(mark: TiptapMark): Transform<TiptapMark, Decoration> {
    return (
      this.transforms.find(tr => tr.types.includes(mark.type)) || getUnsupportedMarkFromTiptap(mark)
    );
  }
}

export class TiptapMarkBidiTransfoms {
  converters: TiptapMarkConverter[];

  constructor(converters: TiptapMarkConverter[]) {
    this.converters = converters;
  }

  toTiptap() {
    return new ToTiptapMarkTransforms(this.converters.map(({ toTiptap }) => toTiptap));
  }

  fromTiptap() {
    return new FromTiptapMarkTransforms(this.converters.map(({ fromTiptap }) => fromTiptap));
  }
}
