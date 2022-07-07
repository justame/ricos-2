import EventEmitter from './lib/EventEmitter';

export class Content<T> extends EventEmitter {
  static EVENTS = {
    contentChangeEvent: 'contentChange',
  };

  private constructor(private content: T, private services = {}) {
    super();
  }

  private resolved = {};

  resolve(contentResolver) {
    if (this.resolved[contentResolver.id]) {
      return this.resolved[contentResolver.id];
    } else {
      this.resolved[contentResolver.id] = contentResolver.resolve(this.content, this.services);
    }
    return this.resolved[contentResolver.id];
  }

  update(content: T) {
    this.content = content;
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
