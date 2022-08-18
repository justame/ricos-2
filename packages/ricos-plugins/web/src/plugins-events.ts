import type { PublisherProvider, IPluginsEvents } from 'ricos-types';

type Topics = [
  'ricos.plugins.functionality.pluginAdd',
  'ricos.plugins.functionality.pluginDelete',
  'ricos.plugins.functionality.pluginToolbarButtonClick',
  'ricos.plugins.functionality.pluginPopoverClick',
  'ricos.plugins.functionality.pluginPopoverTabSwitch',
  'ricos.plugins.functionality.pluginPopoverSearch',
  'ricos.plugins.functionality.pluginChangeSettings',
  'ricos.plugins.functionality.pluginLinkable'
];

const TOPICS: Topics = [
  'ricos.plugins.functionality.pluginAdd',
  'ricos.plugins.functionality.pluginDelete',
  'ricos.plugins.functionality.pluginToolbarButtonClick',
  'ricos.plugins.functionality.pluginPopoverClick',
  'ricos.plugins.functionality.pluginPopoverTabSwitch',
  'ricos.plugins.functionality.pluginPopoverSearch',
  'ricos.plugins.functionality.pluginChangeSettings',
  'ricos.plugins.functionality.pluginLinkable',
];

// ✓  onPluginAction --> table left
// ✓  onChangePluginSettings
// ✓  onPluginAdd --> toolbar button click
// ✓  onPluginAddStep --> modal open
// ✓  onPluginAddSuccess
// ☐  onPluginChange
// ✓  onPluginDelete
// ✓  onPluginsPopOverClick
// ✓  onPluginsPopOverTabSwitch
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

  publishPluginPopoverTabSwitch({ pluginId, buttonName }) {
    return this.publishers
      .byTopic('ricos.plugins.functionality.pluginPopoverTabSwitch')
      .publish({ pluginId, buttonName });
  }

  publishPluginPopoverSearch({ pluginId, searchTerm }) {
    return this.publishers
      .byTopic('ricos.plugins.functionality.pluginPopoverSearch')
      .publish({ pluginId, searchTerm });
  }

  publishPluginChangeSettings({ pluginId, actionName, value }) {
    return this.publishers
      .byTopic('ricos.plugins.functionality.pluginChangeSettings')
      .publish({ pluginId, actionName, value });
  }

  publishPluginLinkable({ pluginId, category, link, nofollow, newTab, anchor }) {
    return this.publishers
      .byTopic('ricos.plugins.functionality.pluginLinkable')
      .publish({ pluginId, category, link, nofollow, newTab, anchor });
  }
}
