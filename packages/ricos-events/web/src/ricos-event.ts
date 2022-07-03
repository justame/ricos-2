import type { Subscription, TopicDescriptor } from 'ricos-types';
import type { RicosEventData } from './event-data';
import type { Event, Subscriber } from './models/event';
import type { Topic } from './models/topics';
import { getEventLogger } from './ricos-event-logger';
import type { AsyncPublishingMetadata, SyncPublishingMetadata } from './ricos-event-logger';
import { RicosTopic } from './topics';

export class EventInitializationError extends Error {}

export class DisposedEventAccessError extends Error {}

const eventLogger = getEventLogger();

export class RicosEvent<T extends RicosEventData> implements Event<RicosEventData> {
  private readonly topic: RicosTopic;

  private static eventId = 0;

  private subscribers: EventSubscriber<RicosEventData>[] = [];

  private isActive = true;

  constructor(topicDescriptor: TopicDescriptor) {
    const topic = RicosTopic.fromString(topicDescriptor);
    if (topic.isWildcard()) {
      throw new EventInitializationError(
        `cannot create event with wildcard topic ${topicDescriptor}`
      );
    }
    this.topic = topic;
  }

  subscribe(handler: (data: T) => void, subscriberId: string): Subscription {
    const subscriber = new EventSubscriber(handler, subscriberId);
    this.subscribers.push(subscriber);
    return {
      topic: this.topic.toString(),
      cancel: () => {
        this.subscribers = this.subscribers.filter(
          (s: EventSubscriber<T>) => s.id !== subscriber.id
        );
      },
    };
  }

  publishSync(data: T): boolean {
    if (!this.isActive) {
      throw new DisposedEventAccessError(`[${this.topic}] cannot publish disposed event`);
    }
    const t1 = performance.now();
    const processings = this.subscribers.map(subscriber => {
      const t3 = performance.now();
      subscriber.invoke(data);
      const t4 = performance.now();
      return {
        subscriberId: subscriber.id,
        duration: t4 - t3,
      };
    });
    const t2 = performance.now();
    const metadata: SyncPublishingMetadata = {
      topic: this.topic.toString(),
      eventId: ++RicosEvent.eventId,
      data,
      duration: t2 - t1,
      timestamp: new Date(),
      isAsync: false,
      processings,
    };
    eventLogger.log(metadata);
    return this.subscribers.length > 0;
  }

  publish(data: T): boolean {
    if (!this.isActive) {
      throw new DisposedEventAccessError(`[${this.topic}] cannot publish disposed event`);
    }
    const t1 = performance.now();
    this.subscribers.forEach(subscriber => setTimeout(() => subscriber.invoke(data), 0));
    const t2 = performance.now();
    const metadata: AsyncPublishingMetadata = {
      topic: this.topic.toString(),
      eventId: ++RicosEvent.eventId,
      data,
      duration: t2 - t1,
      timestamp: new Date(),
      isAsync: true,
    };
    eventLogger.log(metadata);
    return this.subscribers.length > 0;
  }

  getTopic(): Topic {
    return this.topic;
  }

  dispose() {
    this.subscribers = [];
    this.isActive = false;
  }
}

export class EventSubscriber<T extends RicosEventData> implements Subscriber<RicosEventData> {
  readonly callback: (data: T) => void;

  readonly id: string;

  constructor(callback: (data: T) => void, id: string) {
    this.id = id;
    this.callback = callback;
  }

  invoke(data: T): void {
    this.callback(data);
  }
}
