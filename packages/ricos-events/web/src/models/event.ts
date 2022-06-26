import type { EventData, Subscription, TopicDescriptor } from 'ricos-types';
import type { Topic } from './topics';

/**
 * Represents domain event.
 * Responsibilities:
 *  - manages subscriptions
 *  - delivers event data to subscribers
 *
 * @interface Event
 * @template T event data type
 */
export interface Event<T extends EventData> {
  /**
   * Subscribes handler to event
   *
   * @memberof Event
   */
  subscribe(handler: (data: T) => void, id: string): Subscription;
  /**
   * Publishes event synchronously
   *
   * @returns {boolean} whether there is at least one subscriber
   * @memberof Event
   */
  publishSync(data: T): boolean;
  /**
   * Publishes event asynchronously
   *
   * @returns {boolean} whether there is at least one subscriber
   * @memberof Event
   */
  publish(data: T): boolean;
  /**
   * Returns event topic
   *
   * @memberof Event
   */
  getTopic(): Topic;
}

export interface Subscriber<T extends EventData> {
  callback: (data: T) => void;
  invoke(data: T, eventId: number): void;
  id: string;
}
