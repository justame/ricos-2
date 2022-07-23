import { pluginsConfigMerger } from './pluginsConfigMerger';
// eslint-disable-next-line max-len
import { SocialPollsServiceMock } from '../../../../../../examples/main/src/Components/SocialPollsServiceMock/SocialPollsServiceMock';
import { pluginPoll, POLL_TYPE } from '../../../../../plugin-social-polls/web/';

describe('pluginsConfigMerger', () => {
  it('should merge config succesfully', () => {
    const plugins = [pluginPoll()];
    const _rcProps = { config: { [POLL_TYPE]: { pollsClientApi: new SocialPollsServiceMock() } } };
    const mergedPlugins = pluginsConfigMerger(_rcProps.config)(plugins);
    expect(mergedPlugins?.[0].config?.pollsClientApi).toBeTruthy();
  });
});
