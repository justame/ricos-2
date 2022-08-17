import type { PublisherProvider, IPluginsEvents } from 'ricos-types';

type Topics = [
  'ricos.plugins.functionality.pluginAdd',
  'ricos.plugins.functionality.pluginDelete',
  'ricos.plugins.functionality.pluginToolbarButtonClick',
  'ricos.plugins.functionality.pluginPopoverClick'
];

const TOPICS: Topics = [
  'ricos.plugins.functionality.pluginAdd',
  'ricos.plugins.functionality.pluginDelete',
  'ricos.plugins.functionality.pluginToolbarButtonClick',
  'ricos.plugins.functionality.pluginPopoverClick',
];

// ☐  onPluginAction
// ☐  onChangePluginSettings
// ✓  onPluginAdd
// ☐  onPluginAddStep
// ☐  onPluginAddSuccess
// ☐  onPluginChange
// ✓  onPluginDelete
// ✓  onPluginsPopOverClick
// ☐  onPluginsPopOverTabSwitch
// ✓  onToolbarButtonClick --> plugin toolbar button click (includes value)
// ☐  onVideoSelected --> ?

export class PluginsEvents implements IPluginsEvents {
  private publishers!: PublisherProvider<Topics>;

  topicsToPublish = TOPICS;

  publishPluginAdd({ pluginId }) {
    return this.publishers.byTopic('ricos.plugins.functionality.pluginAdd').publish({ pluginId });
  }

  publishPluginDelete({ pluginId }) {
    return this.publishers
      .byTopic('ricos.plugins.functionality.pluginDelete')
      .publish({ pluginId });
  }

  publishPluginToolbarClick({ pluginId, buttonName, value, nodeId }) {
    return this.publishers
      .byTopic('ricos.plugins.functionality.pluginToolbarButtonClick')
      .publish({ pluginId, buttonName, value, nodeId, type: 'PLUGIN' });
  }

  publishPluginPopoverClick({ pluginId, buttonName }) {
    return this.publishers
      .byTopic('ricos.plugins.functionality.pluginPopoverClick')
      .publish({ pluginId, buttonName });
  }
}
