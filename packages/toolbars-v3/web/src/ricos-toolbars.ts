/* eslint-disable brace-style */
import type { PublisherProvider, IRicosToolbar, IRicosToolbars } from 'ricos-types';

type Topics = ['ricos.toolbars.functionality.buttonClick', 'ricos.toolbars.functionality.search'];

const topics: Topics = [
  'ricos.toolbars.functionality.buttonClick',
  'ricos.toolbars.functionality.search',
];

class RicosToolbar implements IRicosToolbar {
  private id: string;

  private publishers!: PublisherProvider<Topics>;

  constructor(id: string, publishers: PublisherProvider<Topics>) {
    this.id = id;
    this.publishers = publishers;
  }

  publishButtonClick(buttonId: string) {
    return this.publishers
      .byTopic('ricos.toolbars.functionality.buttonClick')
      .publish({ toolbarId: this.id, buttonId });
  }

  publishSearch(search: string) {
    return this.publishers
      .byTopic('ricos.toolbars.functionality.search')
      .publish({ toolbarId: this.id, search });
  }
}

export class RicosToolbars implements IRicosToolbars {
  topicsToPublish = topics;

  publishers!: PublisherProvider<Topics>;

  private staticEvents!: IRicosToolbar;

  private floatingEvents!: RicosToolbar;

  private mobileEvents!: IRicosToolbar;

  private externalEvents!: IRicosToolbar;

  private sideEvents!: RicosToolbar;

  private footerEvents!: RicosToolbar;

  private pluginEvents!: RicosToolbar;

  private pluginMenuEvents!: RicosToolbar;

  get static() {
    if (!this.static) {
      this.staticEvents = new RicosToolbar('static', this.publishers);
    }
    return this.staticEvents;
  }

  get floating() {
    if (!this.floating) {
      this.floatingEvents = new RicosToolbar('floating', this.publishers);
    }
    return this.floatingEvents;
  }

  get mobile() {
    if (!this.mobile) {
      this.mobileEvents = new RicosToolbar('mobile', this.publishers);
    }
    return this.mobileEvents;
  }

  get external() {
    if (!this.external) {
      this.externalEvents = new RicosToolbar('external', this.publishers);
    }
    return this.externalEvents;
  }

  get side() {
    if (!this.side) {
      this.sideEvents = new RicosToolbar('side', this.publishers);
    }
    return this.sideEvents;
  }

  get footer() {
    if (!this.footer) {
      this.footerEvents = new RicosToolbar('footer', this.publishers);
    }
    return this.footerEvents;
  }

  get plugin() {
    if (!this.plugin) {
      this.pluginEvents = new RicosToolbar('plugin', this.publishers);
    }
    return this.pluginEvents;
  }

  get pluginMenu() {
    if (!this.pluginMenu) {
      this.pluginMenuEvents = new RicosToolbar('pluginMenu', this.publishers);
    }
    return this.pluginMenuEvents;
  }
}
