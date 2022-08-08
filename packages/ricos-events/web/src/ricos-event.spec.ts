import type { ImageData } from 'ricos-schema';

import { EventInitializationError, RicosEvent } from './ricos-event';
import type { EventLogger } from './ricos-event-logger';

const logger: EventLogger = {
  log: () => {},
};

describe('RicosEvent', () => {
  it('should instantiate event from topic string', () => {
    const event = new RicosEvent('ricos.event.test.instance', logger);
    expect(event.getTopic().toString()).toBe('ricos.event.test.instance');
  });

  it('should throw EventInitializationError for invalid topic', () => {
    expect(() => {
      const _event = new RicosEvent('ricos.event.test.*', logger);
    }).toThrowError(EventInitializationError);
  });

  it('should return subsciption to subscriber', () => {
    const event = new RicosEvent('ricos.event.test.subscribe', logger);
    const subscription = event.subscribe(() => {}, 'subscriber-id');
    expect(subscription.topic).toBe('ricos.event.test.subscribe');
  });

  it('should publish event synchronously', () => {
    const event = new RicosEvent('ricos.event.test.publishSync', logger);
    const handler = jest.fn();
    event.subscribe(handler, 'subscriber-id');
    expect(event.publishSync({})).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should publish event asynchronously', () => {
    const event = new RicosEvent('ricos.event.test.publish', logger);
    const handler = jest.fn();
    event.subscribe(handler, 'subscriber-id');
    jest.useFakeTimers();
    expect(event.publish({})).toBe(true);
    jest.runAllTimers();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should indicate that event has no subscribers', () => {
    const event = new RicosEvent('ricos.event.test.noSubscribers', logger);
    expect(event.publishSync({})).toBe(false);
    expect(event.publish({})).toBe(false);
  });

  it('should allow to cancel subscription', () => {
    const event = new RicosEvent('ricos.event.test.cancelSubscription', logger);
    const handler = jest.fn();
    const subscription = event.subscribe(handler, 'subscriber-id');
    expect(event.publishSync({})).toBe(true);
    expect(event.publish({})).toBe(true);
    subscription.cancel();
    expect(event.publishSync({})).toBe(false);
    expect(event.publish({})).toBe(false);
  });
});

describe('RicosEvent<ImageData>', () => {
  it('should allow to publish ImageEventData', () => {
    const event = new RicosEvent<ImageData>('ricos.event.test.customDataType', logger);
    const handler = jest.fn();
    event.subscribe(handler, 'subscriber-id');
    const imageData: ImageData = {
      altText: 'alt text',
      caption: 'caption',
      disableDownload: false,
    };
    expect(event.publishSync(imageData)).toBe(true);
    expect(handler.mock.calls[0][0]).toEqual('ricos.event.test.customDataType');
    expect(handler.mock.calls[0][1]).toEqual(imageData);
  });
});
