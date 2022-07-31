import type {
  EventData,
  EventPublisher,
  SubscribeTopicDescriptor,
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
  onDomReady(setErrorNotifier: () => INotifier, setFileInput: () => HTMLInputElement): void;
}

export interface Event extends EventPublisher<EventData> {}

export interface EventSource {
  events: TopicDescriptor[];
}

export interface Policy<T extends EventData> {
  topic: SubscribeTopicDescriptor;
  handler: (topic: TopicDescriptor, data: T) => void;
}
