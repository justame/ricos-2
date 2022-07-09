import type { SubscribeTopicDescriptor, TopicComponent, TopicDescriptor } from 'ricos-types';

/**
 * Represents event topic
 *
 * Example: topic `ricos.editor.functionality.loaded` consists of:
 * - `ricos` - domain name (all public events are published under this domain)
 * - `editor` - subdomain name
 * - `functionality` - event context
 * - `loaded` - event name
 *
 *
 * @interface Topic
 */
export interface Topic {
  /**
   * Creates new topic from string, validates correctness
   *
   * @memberof Topic
   */
  fromString: (topic: TopicDescriptor) => Topic;
  /**
   * Returns domain component of topic
   *
   * @type {string}
   * @memberof Topic
   */
  domain: TopicComponent;
  /**
   * Returns subdomain component of topic
   *
   * @type {string}
   * @memberof Topic
   */
  subdomain: TopicComponent;
  /**
   * Returns context component of topic
   *
   * @type {string}
   * @memberof Topic
   */
  context: TopicComponent;
  /**
   * Returns event name
   *
   * @type {string}
   * @memberof Topic
   */
  event: TopicComponent;
  /**
   * Returns topic as string
   *
   * @returns  {string}
   * @memberof Topic
   */
  toString(): TopicDescriptor;

  /**
   * Determines whether a topic contains a '*' in any position
   *
   * @memberof Topic
   */
  isWildcard: () => boolean;

  /**
   * Determines whether a topic matches another topic (wildcards are allowed)
   *
   * @memberof Topic
   */
  matches: (glob: SubscribeTopicDescriptor) => boolean;

  /**
   * Determines whether a topic equals another topic
   *
   * @memberof Topic
   *
   * @param {Topic} topic
   * @returns {boolean}
   */
  equals: (topic: Topic) => boolean;
}

/**
 * Aggregates topic collection
 *
 * @interface Topics
 */
export interface Topics {
  /**
   * Filters topics, supports wildcard
   *
   * @memberof Topics
   */
  getTopics: (glob: TopicDescriptor) => Topics;
}
