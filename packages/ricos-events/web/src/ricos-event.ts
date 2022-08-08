import type { Subscription, TopicDescriptor } from 'ricos-types';
import type { RicosEventData } from './event-data';
import type { Event, Subscriber } from './models/event';
import type { Topic } from './models/topics';
import type {
  AsyncPublishingMetadata,
  EventLogger,
  SyncPublishingMetadata,
} from './ricos-event-logger';
import { RicosTopic } from './topics';

export class EventInitializationError extends Error {}

export class DisposedEventAccessError extends Error {}

export class RicosEvent<T extends RicosEventData> implements Event<RicosEventData> {
  private readonly topic: RicosTopic;

  private static eventId = 0;

  private subscribers: EventSubscriber<RicosEventData>[] = [];

  private isActive = true;

  private logger: EventLogger;

  constructor(topicDescriptor: TopicDescriptor, logger: EventLogger) {
    this.logger = logger;
    const topic = RicosTopic.fromString(topicDescriptor);
    if (topic.isWildcard()) {
      throw new EventInitializationError(
        `cannot create event with wildcard topic ${topicDescriptor}`
      );
    }
    this.topic = topic;
  }

  subscribe(
    handler: (topic: TopicDescriptor, data: T) => void,
    subscriberId: string
  ): Subscription {
    const subscriber = new EventSubscriber(handler, subscriberId);
    if (this.isDuplicateSubscriber(subscriber)) {
      console.warn(
        `A duplicate subscriber ${subscriberId} for topic ${this.topic} detected.`,
        `Possible reasons: multiple instances of the same component subscribing, or wrong lifecycle management.`
      );
    }
    this.subscribers.push(subscriber);
    console.debug(`[${this.topic}]: ${subscriberId} subscribed`); // eslint-disable-line no-console
    return {
      topic: this.topic.toString(),
      cancel: () => {
        console.debug(`[${this.topic}]: ${subscriberId} unsubscribed`); // eslint-disable-line no-console
        this.subscribers = this.subscribers.filter(
          (s: EventSubscriber<T>) => s.id !== subscriber.id
        );
      },
    };
  }

  private isDuplicateSubscriber(subscriber: EventSubscriber<T>) {
    return this.subscribers.some(s => s.id === subscriber.id);
  }

  publishSync(data: T): boolean {
    if (!this.isActive) {
      throw new DisposedEventAccessError(`[${this.topic}] cannot publish disposed event`);
    }
    const t1 = performance.now();
    const processings = this.subscribers.map(subscriber => {
      const t3 = performance.now();
      subscriber.invoke(this.topic.toString(), data);
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
    this.logger.log(metadata);
    return this.subscribers.length > 0;
  }

  publish(data: T): boolean {
    if (!this.isActive) {
      throw new DisposedEventAccessError(`[${this.topic}] cannot publish disposed event`);
    }
    const t1 = performance.now();
    this.subscribers.forEach(subscriber =>
      setTimeout(() => subscriber.invoke(this.topic.toString(), data), 0)
    );
    const t2 = performance.now();
    const metadata: AsyncPublishingMetadata = {
      topic: this.topic.toString(),
      eventId: ++RicosEvent.eventId,
      data,
      duration: t2 - t1,
      timestamp: new Date(),
      isAsync: true,
    };
    this.logger.log(metadata);
    return this.subscribers.length > 0;
  }

  publishOnce(data: T): boolean {
    const published = this.publish(data);
    if (published) {
      this.dispose();
    }
    return published;
  }

  getTopic(): Topic {
    return this.topic;
  }

  dispose() {
    this.subscribers = [];
    this.isActive = false;
    console.debug(`[${this.topic}]: event disposed`); // eslint-disable-line no-console
  }
}

export class EventSubscriber<T extends RicosEventData> implements Subscriber<RicosEventData> {
  readonly callback: (topic: TopicDescriptor, data: T) => void;

  readonly id: string;

  constructor(callback: (topic: TopicDescriptor, data: T) => void, id: string) {
    this.id = id;
    this.callback = callback;
  }

  invoke(topic: TopicDescriptor, data: T): void {
    this.callback(topic, data);
  }
}
