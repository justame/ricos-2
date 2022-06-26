import { RicosTopics } from './topics';

describe('RicosTopics', () => {
  const topics = RicosTopics.of([
    'ricos.topics.test.instance',
    'ricos.topics.test.getTopics',
    'ricos.topic.test.instance',
    'ricos.topic.test.matches',
  ]);
  it('should instantiate Topics of TopicDescriptors', () => {
    expect(topics.asArray().length).toBe(4);
  });

  it('should filter topics', () => {
    const filtered = topics.filter(topic => topic.subdomain === 'topics');
    expect(filtered.asArray().length).toBe(2);
  });

  it('should clear topics', () => {
    const cleared = topics.clear();
    expect(cleared.asArray().length).toBe(0);
  });

  it('should throw when instantiating Topics of invalid TopicDescriptors', () => {
    expect(() => RicosTopics.of(['...invalid'])).toThrowError(/Invalid topic:/);
  });

  it('should get matching topics by glob', () => {
    expect(topics.getTopics('rikos.*.*.*').asArray().length).toBe(0);
    expect(topics.getTopics('*.*.*.getTopics').asArray().length).toBe(1);
    expect(topics.getTopics('ricos.*.*.instance').asArray().length).toBe(2);
    expect(topics.getTopics('ricos.*.test.*').asArray().length).toBe(4);
    expect(topics.getTopics('*').asArray().length).toBe(4);
  });
});
