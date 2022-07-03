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

export class RicosEvents implements EventRegistrar, EventSubscriptor {
  private events: RicosEvent<RicosEventData>[] = [];

  register<T extends RicosEventData>(topic: TopicDescriptor): EventPublisher<T> {
    const event = new RicosEvent<T>(topic);
    this.events.push(event);
    return new RicosEventPublisher(event);
  }

  subscribe(
    topic: SubscribeTopicDescriptor,
    handler: (data: EventData) => void,
    id: string
  ): Subscription {
    const subscriptions = this.events
      .filter(e => e.getTopic().matches(topic))
      .map(e => e.subscribe(handler, id));
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

  get topic(): TopicDescriptor {
    return this.event.getTopic().toString();
  }
}
