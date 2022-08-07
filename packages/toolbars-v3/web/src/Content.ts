import type { Node } from 'prosemirror-model';
import type { IContent } from 'ricos-types';
import EventEmitter from './lib/EventEmitter';

export class Content<T = Node[]> extends EventEmitter implements IContent<T> {
  static EVENTS = {
    contentChangeEvent: 'contentChange',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;

  private constructor(private content: T, private services = {}) {
    super();
  }

  private resolved = {};

  resolve(contentResolver) {
    //TODO: cache should invalidate when content change and when state of editor change ( stored marks)
    // if (this.resolved[contentResolver.id]) {
    //   return this.resolved[contentResolver.id];
    // } else {
    //   this.resolved[contentResolver.id] = contentResolver.resolve(
    //     this.content,
    //     this.services,
    //     this.editor
    //   );
    // }
    return contentResolver.resolve(this.content, this.services, this.editor);
  }

  //TODO: should be removed
  forceUpdate() {
    this.update(this.content, this.editor);
  }

  update(content: T, editor) {
    this.content = content;
    this.editor = editor;
    this.resolved = {};
    this.emit(Content.EVENTS.contentChangeEvent);
  }

  get value() {
    return this.content;
  }

  isEmpty() {
    return !!this.content;
  }

  static create<T>(content: T, services = {}) {
    return new Content(content, services);
  }
}
