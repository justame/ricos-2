import type {
  EventData,
  EventPublisher,
  EventRegistrar,
  EventSubscriptor,
  SubscribeTopicDescriptor,
  Subscription,
  TopicDescriptor,
} from 'ricos-types';
import type { RicosEventData } from './event-data';
import { RicosEvent } from './ricos-event';

export class DuplicateEventRegistrationError extends Error {}

export class RicosEvents implements EventRegistrar, EventSubscriptor {
  private events: RicosEvent<RicosEventData>[] = [];

  register<T extends RicosEventData>(topic: TopicDescriptor): EventPublisher<T> {
    const event = new RicosEvent<T>(topic);
    if (this.events.some(e => e.getTopic().equals(event.getTopic()))) {
      throw new DuplicateEventRegistrationError(`Event ${topic} already registered`);
    }
    this.events.push(event);
    console.debug(`[${topic}]: event registered`); // eslint-disable-line no-console
    return new RicosEventPublisher(event);
  }

  getAllTopics(): TopicDescriptor[] {
    return this.events.map(e => e.getTopic().toString());
  }

  subscribe(
    topic: SubscribeTopicDescriptor,
    handler: (topic: TopicDescriptor, data: EventData) => void,
    id: string
  ): Subscription {
    const subscriptions = this.events
      .filter(e => e.getTopic().matches(topic))
      .map(e => e.subscribe(handler, id));
    if (subscriptions.length === 0) {
      console.warn(`No event found for topic ${topic} while subscribing ${id}`);
    }
    return {
      topic,
      cancel: () => subscriptions.forEach(s => s.cancel()),
    };
  }

  clear() {
    this.events.forEach(e => e.dispose());
    this.events = [];
  }
}

class RicosEventPublisher<T extends RicosEventData> implements EventPublisher<T> {
  constructor(private event: RicosEvent<T>) {
    this.event = event;
  }

  publish(data: T) {
    return this.event.publish(data);
  }

  publishSync(data: T) {
    return this.event.publishSync(data);
  }

  publishOnce(data: T) {
    return this.event.publishOnce(data);
  }

  get topic(): TopicDescriptor {
    return this.event.getTopic().toString();
  }
}
