import type { Eq } from 'fp-ts/Eq';
import { fromEquals, struct } from 'fp-ts/Eq';
import type { SubscribeTopicDescriptor, TopicComponent, TopicDescriptor } from 'ricos-types';
import type { Topic, Topics } from './models/topics';

const TopicComponentEq: Eq<TopicComponent> = fromEquals(
  (component1, component2) => component1 === component2 || component1 === '*' || component2 === '*'
);

const TopicEq: Eq<Topic> = struct({
  domain: TopicComponentEq,
  subdomain: TopicComponentEq,
  context: TopicComponentEq,
  event: TopicComponentEq,
});

export class InvalidTopicError extends Error {
  constructor(public topic: string) {
    super(`Invalid topic: ${topic}`);
  }
}

export class RicosTopic implements Topic {
  private readonly _domain: TopicComponent;

  private readonly _subdomain: TopicComponent;

  private readonly _context: TopicComponent;

  private readonly _event: TopicComponent;

  isWildcard() {
    return (
      this._event === '*' ||
      this._context === '*' ||
      this._subdomain === '*' ||
      this._domain === '*'
    );
  }

  fromString(topic: TopicDescriptor) {
    return RicosTopic.fromString(topic);
  }

  get domain(): TopicComponent {
    return this._domain;
  }

  get subdomain(): TopicComponent {
    return this._subdomain;
  }

  get context(): TopicComponent {
    return this._context;
  }

  get event(): TopicComponent {
    return this._event;
  }

  private constructor(
    domain: TopicComponent,
    subdomain: TopicComponent,
    context: TopicComponent,
    event: TopicComponent
  ) {
    this._domain = domain;
    this._subdomain = subdomain;
    this._context = context;
    this._event = event;
  }

  toString(): TopicDescriptor {
    return `${this.domain}.${this.subdomain}.${this.context}.${this.event}`;
  }

  equals(other: Topic): boolean {
    return this.toString() === other.toString();
  }

  matches(glob: SubscribeTopicDescriptor): boolean {
    try {
      return glob === '*' || TopicEq.equals(this, RicosTopic.fromString(glob));
    } catch (e) {
      return false;
    }
  }

  static fromString(topic: TopicDescriptor): RicosTopic {
    const [domain, subdomain, context, event] = topic.split('.');
    if (!domain || !subdomain || !context || !event) {
      throw new InvalidTopicError(topic);
    }
    return new RicosTopic(domain, subdomain, context, event);
  }
}

export class RicosTopics implements Topics {
  private readonly topics: RicosTopic[] = [];

  constructor(topics: RicosTopic[]) {
    this.topics = topics;
  }

  static of(topics: TopicDescriptor[]): RicosTopics {
    return new RicosTopics(topics.map(RicosTopic.fromString));
  }

  filter(predicate: (topic: RicosTopic) => boolean): RicosTopics {
    return new RicosTopics(this.topics.filter(predicate));
  }

  clear(): RicosTopics {
    return new RicosTopics([]);
  }

  asArray(): Topic[] {
    return this.topics;
  }

  getTopics(glob: SubscribeTopicDescriptor): RicosTopics {
    return new RicosTopics(this.topics.filter(topic => topic.matches(glob)));
  }
}
