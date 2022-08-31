import type {
  EventData,
  EventRegistrar,
  EventSubscriptor,
  SubscribeTopicDescriptor,
  TopicDescriptor,
} from 'ricos-types';
import { PublisherInitializer, SubscriptorInitializer } from './event-orchestrators';

export type RicosEventSource = {
  topicsToPublish: TopicDescriptor[];
  publishers: PublisherInitializer;
};

export type RicosEventSubscriber = {
  id: string;
  topicsToSubscribe: SubscribeTopicDescriptor[];
  subscriptors: SubscriptorInitializer;
};
export function registerEventSources(events: EventRegistrar, eventSources: RicosEventSource[]) {
  eventSources.forEach(source => {
    const initializer = new PublisherInitializer(source.topicsToPublish);
    initializer.initializeMap((t: TopicDescriptor) => events.register(t));
    source.publishers = initializer;
  });
}

export function registerEventSubscribers(
  events: EventSubscriptor,
  eventSubscribers: RicosEventSubscriber[]
) {
  eventSubscribers.forEach(subscriber => {
    const initializer = new SubscriptorInitializer(subscriber.topicsToSubscribe);
    initializer.initializeMap((t: SubscribeTopicDescriptor) => ({
      subscribe: (handler: (topic: TopicDescriptor, data: EventData) => void) =>
        events.subscribe(t, handler, subscriber.id),
    }));
    subscriber.subscriptors = initializer;
  });
}
