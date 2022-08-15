/* eslint-disable brace-style */
import { TOOLBARS } from 'wix-rich-content-editor-common';
import type {
  PublisherProvider,
  IRicosToolbar,
  IRicosToolbars,
  ToolbarType,
  KeyboardShortcut,
} from 'ricos-types';

type Topics = [
  'ricos.toolbars.functionality.buttonClick',
  'ricos.toolbars.instance.loaded',
  'ricos.toolbars.functionality.search'
];

const topics: Topics = [
  'ricos.toolbars.functionality.buttonClick',
  'ricos.toolbars.instance.loaded',
  'ricos.toolbars.functionality.search',
];

class RicosToolbar implements IRicosToolbar {
  readonly type: ToolbarType;

  private publishers!: PublisherProvider<Topics>;

  constructor(type: ToolbarType, publishers: PublisherProvider<Topics>) {
    this.type = type;
    this.publishers = publishers;
  }

  publishButtonClick(buttonId: string) {
    return this.publishers
      .byTopic('ricos.toolbars.functionality.buttonClick')
      .publish({ toolbarType: this.type, buttonId });
  }

  publishSearch(search: string) {
    return this.publishers
      .byTopic('ricos.toolbars.functionality.search')
      .publish({ toolbarType: this.type, search });
  }

  publishInstanceLoaded() {
    return this.publishers
      .byTopic('ricos.toolbars.instance.loaded')
      .publish({ toolbarType: this.type });
  }
}

export class RicosToolbars implements IRicosToolbars {
  topicsToPublish = topics;

  publishers!: PublisherProvider<Topics>;

  private staticToolbar!: IRicosToolbar;

  private inlineToolbar!: RicosToolbar;

  private mobileToolbar!: IRicosToolbar;

  private externalToolbar!: IRicosToolbar;

  private sideToolbar!: RicosToolbar;

  private footerToolbar!: RicosToolbar;

  private pluginToolbar!: RicosToolbar;

  private pluginMenuToolbar!: RicosToolbar;

  private linkToolbar!: RicosToolbar;

  get static() {
    if (!this.staticToolbar) {
      this.staticToolbar = new RicosToolbar(TOOLBARS.STATIC, this.publishers);
    }
    return this.staticToolbar;
  }

  get inline() {
    if (!this.inlineToolbar) {
      this.inlineToolbar = new RicosToolbar(TOOLBARS.INLINE, this.publishers);
    }
    return this.inlineToolbar;
  }

  get mobile() {
    if (!this.mobileToolbar) {
      this.mobileToolbar = new RicosToolbar(TOOLBARS.MOBILE, this.publishers);
    }
    return this.mobileToolbar;
  }

  get external() {
    if (!this.externalToolbar) {
      this.externalToolbar = new RicosToolbar(TOOLBARS.EXTERNAL, this.publishers);
    }
    return this.externalToolbar;
  }

  get side() {
    if (!this.sideToolbar) {
      this.sideToolbar = new RicosToolbar(TOOLBARS.SIDE, this.publishers);
    }
    return this.sideToolbar;
  }

  get footer() {
    if (!this.footerToolbar) {
      this.footerToolbar = new RicosToolbar(TOOLBARS.FOOTER, this.publishers);
    }
    return this.footerToolbar;
  }

  get plugin() {
    if (!this.pluginToolbar) {
      this.pluginToolbar = new RicosToolbar(TOOLBARS.PLUGIN, this.publishers);
    }
    return this.pluginToolbar;
  }

  get pluginMenu() {
    if (!this.pluginMenuToolbar) {
      this.pluginMenuToolbar = new RicosToolbar(TOOLBARS.PLUGIN_MENU, this.publishers);
    }
    return this.pluginMenuToolbar;
  }

  get link() {
    if (!this.linkToolbar) {
      this.linkToolbar = new RicosToolbar(TOOLBARS.LINK, this.publishers);
    }
    return this.linkToolbar;
  }

  byType(type: ToolbarType) {
    const toolbars = [
      this.link,
      this.pluginMenu,
      this.plugin,
      this.footer,
      this.side,
      this.external,
      this.mobile,
      this.inline,
      this.static,
    ];
    return toolbars.filter(toolbar => toolbar.type === type)[0];
  }

  getShortcuts(): KeyboardShortcut[] {
    const focusShortcut: KeyboardShortcut = {
      name: 'Focus Toolbar',
      description: 'Focusing on open toolbar',
      keys: { macOs: 'Ctrl+T', windows: 'Alt+T' },
      command() {
        const firstFloatingFormattingToolbarButton = document.querySelector(
          `[data-hook='floating-formatting-toolbar'] [data-hook='toolbar-v3-visible'] Button`
        ) as HTMLElement;
        firstFloatingFormattingToolbarButton?.focus();

        const firstStaticFormattingToolbarButton = document.querySelector(
          `[data-hook='static-toolbar'] [data-hook='toolbar-v3-visible'] Button`
        ) as HTMLElement;
        firstStaticFormattingToolbarButton?.focus();

        const firstLinkToolbarButton = document.querySelector(
          `[data-hook='linkPluginToolbar'] [data-hook='toolbar-v3-visible'] a`
        ) as HTMLElement;
        firstLinkToolbarButton?.focus();
      },
      group: 'global',
      enabled: true,
    };

    return [focusShortcut];
  }
}
