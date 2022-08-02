import type {
  EventData,
  EventPublisher,
  SubscribeTopicDescriptor,
  Subscription,
  TopicDescriptor,
} from './events';
import type { RicosServices } from './services';
import type { INotifier } from './uploadServicesTypes';

/**
 * Orchestrates subdomian aggregate lifecycle and dependencies
 *
 * Responsibilities:
 * - instantiate subdomain aggregates, injecting relevant dependencies
 * - register events of any EventSources
 * - subscribe any PolicySubscribers
 * - finalize subdomain aggregates
 * - expose RicosServices
 *
 * @export
 * @interface Orchestrator
 */
export interface Orchestrator {
  getServices(): RicosServices;
  finalize(): void;
  setUpdateServiceDom(
    setErrorNotifier: () => INotifier,
    setFileInput: () => HTMLInputElement
  ): void;
}

/**
 * Provides event publishers to event sources
 *
 * @export
 * @interface PublisherProvider
 * @template T
 */
export interface PublisherProvider<T extends TopicDescriptor[]> {
  byTopic(key: T[number]): EventPublisher<EventData>;
}

/**
 * Admits publishing of certain topics. Allows event registration in orchestrated manner.
 *
 * @export
 * @interface EventSource
 * @template T
 */
export interface EventSource<T extends TopicDescriptor[]> {
  topicsToPublish: T;
  publishers: PublisherProvider<T>;
}

export type Subscriptor = (
  handler: (topic: TopicDescriptor, data: EventData) => void
) => Subscription;

/**
 * Provides subscriptor to event subscriber
 *
 * @export
 * @interface SubscriptionProvider
 * @template T
 */
export interface SubscriptorProvider<T extends SubscribeTopicDescriptor[]> {
  byTopic(key: T[number]): { subscribe: Subscriptor };
}

/**
 * Admits subscribing to certain topics
 *
 * @export
 * @interface PolicySubscriber
 * @template T
 */
export interface PolicySubscriber<T extends SubscribeTopicDescriptor[]> {
  id: string;
  topicsToSubscribe: T;
  subscriptors: SubscriptorProvider<T>;
}
