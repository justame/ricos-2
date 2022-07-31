import { mergeConfig } from './mergeConfig';
import { pluginPoll, POLL_TYPE } from '../../../plugin-social-polls/web/';

describe('mergeConfig', () => {
  it('should merge config succesfully', () => {
    const plugins = [pluginPoll()];
    const _rcProps = { config: { [POLL_TYPE]: { pollsClientApi: { mock: true } } } };
    const mergedPlugins = mergeConfig(_rcProps.config)(plugins);
    expect(mergedPlugins?.[0].config?.pollsClientApi.mock).toBeTruthy();
  });
});
