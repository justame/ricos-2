import type {
  EventData,
  EventPublisher,
  Subscriptor,
  SubscribeTopicDescriptor,
  TopicDescriptor,
} from 'ricos-types';

/**
 * Absrtact mapper of keys K[] to value hash `{ [k: K]: V }` by given V initializer `K --> V`
 *
 * @class MapInitializer
 * @template K key type
 * @template V value type
 */
class MapInitializer<K extends string, V> {
  private map!: { [key: string]: V };

  private keys: K[];

  constructor(keys: K[]) {
    this.keys = keys;
  }

  byTopic(key: K): V {
    return this.map[key];
  }

  initializeMap(initilaizer: (key: K) => V): void {
    this.map = this.keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: initilaizer(key),
      }),
      {} as { [key: string]: V }
    );
  }
}

export class SubscriptorInitializer extends MapInitializer<
  SubscribeTopicDescriptor,
  { subscribe: Subscriptor }
> {}

export class PublisherInitializer extends MapInitializer<
  TopicDescriptor,
  EventPublisher<EventData>
> {}
