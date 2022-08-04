import type {
  EventData,
  RicosEventTarget,
  SubscribeTopicDescriptor,
  TopicDescriptor,
} from 'ricos-types';

type Listeners = {
  [topic: string]: ((topic: TopicDescriptor, data: EventData) => void)[];
};
export class EditorEventTarget implements RicosEventTarget {
  private readonly listeners: Listeners = {};

  addEventListener(
    topic: SubscribeTopicDescriptor,
    listener: (topic: TopicDescriptor, data: EventData) => void
  ) {
    this.listeners[topic] = this.listeners[topic]
      ? [...this.listeners[topic], listener]
      : [listener];
  }

  removeEventListener(
    topic: SubscribeTopicDescriptor,
    listener: (topic: TopicDescriptor, data: EventData) => void
  ) {
    this.listeners[topic] = this.listeners[topic].filter(
      l => l !== listener || l.toString() !== listener.toString()
    );
  }
}
