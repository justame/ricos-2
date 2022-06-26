import type { ImageData, DividerData } from 'ricos-schema';
import { DividerData_Width, DividerData_Alignment, DividerData_LineStyle } from 'ricos-schema';
import { RicosEvents } from './events';

describe('RicosEvents', () => {
  it('should register event by topic', () => {
    const events = new RicosEvents();
    const topic = 'ricos.editor.functionality.loaded';
    const publisher = events.register(topic);
    expect(publisher.topic).toBe(topic);
  });

  it('should throw on invalid topic registration', () => {
    const events = new RicosEvents();
    expect(() => {
      events.register('ricos.editor.functionality.*');
    }).toThrowError(/cannot create event with wildcard/);
  });

  it('should allow to subscribe to all events', () => {
    const events = new RicosEvents();
    const loadEditorPublisher = events.register('ricos.editor.functionality.loaded');
    const imageAddedPublisher = events.register('ricos.image.instance.added');
    const handler = jest.fn();
    const subscription = events.subscribe('*', handler, 'subscriber-id');
    expect(subscription.topic).toBe('*');
    expect(subscription.cancel).toBeDefined();
    expect(handler).toHaveBeenCalledTimes(0);

    loadEditorPublisher.publishSync({ type: 'loaded' });
    imageAddedPublisher.publishSync({ type: 'added' });
    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler.mock.calls[0][0]).toEqual({ type: 'loaded' });
    expect(handler.mock.calls[1][0]).toEqual({ type: 'added' });
  });

  it('should allow to subscribe to specific event', () => {
    const events = new RicosEvents();
    const loadEditorPublisher = events.register('ricos.editor.functionality.loaded');
    const imageAddedPublisher = events.register('ricos.image.instance.added');
    const handler = jest.fn();
    const subscription = events.subscribe(
      'ricos.editor.functionality.loaded',
      handler,
      'subscriber-id'
    );
    expect(subscription.topic).toBe('ricos.editor.functionality.loaded');
    expect(subscription.cancel).toBeDefined();
    expect(handler).toHaveBeenCalledTimes(0);

    loadEditorPublisher.publishSync({ type: 'loaded' });
    imageAddedPublisher.publishSync({ type: 'added' });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toEqual({ type: 'loaded' });
  });

  it('should allow to cancel subscription', () => {
    const events = new RicosEvents();
    const loadEditorPublisher = events.register('ricos.editor.functionality.loaded');
    const imageAddedPublisher = events.register('ricos.image.instance.added');
    const handler = jest.fn();
    const subscription = events.subscribe(
      'ricos.editor.functionality.loaded',
      handler,
      'subscriber-id'
    );
    expect(subscription.topic).toBe('ricos.editor.functionality.loaded');
    expect(subscription.cancel).toBeDefined();
    expect(handler).toHaveBeenCalledTimes(0);

    loadEditorPublisher.publishSync({ type: 'loaded' });
    imageAddedPublisher.publishSync({ type: 'added' });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toEqual({ type: 'loaded' });

    subscription.cancel();
    loadEditorPublisher.publishSync({ type: 'loaded' });
    imageAddedPublisher.publishSync({ type: 'added' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should allow to subscribe to all events and cancel subscription', () => {
    const events = new RicosEvents();
    const loadEditorPublisher = events.register('ricos.editor.functionality.loaded');
    const imageAddedPublisher = events.register('ricos.image.instance.added');
    const handler = jest.fn();
    const subscription = events.subscribe('*', handler, 'subscriber-id');
    expect(subscription.topic).toBe('*');
    expect(subscription.cancel).toBeDefined();
    expect(handler).toHaveBeenCalledTimes(0);

    loadEditorPublisher.publishSync({ type: 'loaded' });
    imageAddedPublisher.publishSync({ type: 'added' });
    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler.mock.calls[0][0]).toEqual({ type: 'loaded' });
    expect(handler.mock.calls[1][0]).toEqual({ type: 'added' });

    subscription.cancel();
    loadEditorPublisher.publishSync({ type: 'loaded' });
    imageAddedPublisher.publishSync({ type: 'added' });
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('should prevent publishing of disposed events', () => {
    const events = new RicosEvents();
    const loadEditorPublisher = events.register('ricos.editor.functionality.loaded');
    const imageAddedPublisher = events.register('ricos.image.instance.added');
    const handler = jest.fn();
    events.subscribe('*', handler, 'subscriber-id');

    loadEditorPublisher.publishSync({ type: 'loaded' });
    imageAddedPublisher.publishSync({ type: 'added' });
    expect(handler).toHaveBeenCalledTimes(2);

    events.clear();

    expect(() => loadEditorPublisher.publishSync({ type: 'loaded' })).toThrowError(
      /cannot publish disposed event/
    );
    expect(() => imageAddedPublisher.publishSync({ type: 'added' })).toThrowError(
      /cannot publish disposed event/
    );
    expect(handler).toHaveBeenCalledTimes(2);
  });
});

describe('RicosEvents with custom data', () => {
  it('should allow to register custom data events', () => {
    const events = new RicosEvents();
    const imageAddedPublisher = events.register<ImageData>('ricos.image.instance.added');
    const dividerAddedPublisher = events.register<DividerData>('ricos.divider.instance.added');
    const handler = jest.fn();
    events.subscribe('*', handler, 'subscriber-id');

    const imageData: ImageData = {
      altText: 'alt text',
      caption: 'caption',
      disableDownload: false,
    };
    const dividerData: DividerData = {
      alignment: DividerData_Alignment.CENTER,
      lineStyle: DividerData_LineStyle.SINGLE,
      width: DividerData_Width.LARGE,
    };
    imageAddedPublisher.publishSync(imageData);
    dividerAddedPublisher.publishSync(dividerData);
    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler.mock.calls[0][0]).toEqual(imageData);
    expect(handler.mock.calls[1][0]).toEqual(dividerData);
  });
});
