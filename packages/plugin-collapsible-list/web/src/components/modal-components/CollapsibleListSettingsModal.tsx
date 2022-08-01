import React, { Component } from 'react';
import classNames from 'classnames';
import type {
  AvailableExperiments,
  RichContentTheme,
  Store,
  TextDirection,
  TranslationFunction,
} from 'wix-rich-content-common';
import { mergeStyles } from 'wix-rich-content-common';
import type { ComponentData } from '../domain/collapsibleList';
import { CollapsibleList } from '../domain/collapsibleList';
import {
  SettingsPanelFooter,
  SettingsMobileHeader,
  SettingsPanelHeader,
} from 'wix-rich-content-ui-components';
import CollapsibleListSettings from './CollapsibleListSettings';
import styles from '../../../statics/styles/collapsible-list-modal.scss';

interface Props {
  theme: RichContentTheme;
  t: TranslationFunction;
  isMobile: boolean;
  languageDir: TextDirection;
  experiments: AvailableExperiments;
  componentData: ComponentData;
  updateData: (data) => void;
  onSave: () => void;
  onCancel: () => void;
}

class CollapsibleListSettingsModal extends Component<Props> {
  styles: Record<string, string>;

  constructor(props) {
    super(props);
    this.state = this.initState();
    const { theme } = props;
    this.styles = mergeStyles({ styles, theme });
  }

  useNewSettingsUi = this.props.experiments?.newSettingsModals?.enabled;

  modalsWithEditorCommands = this.props.experiments?.tiptapEditor?.enabled;

  initState() {
    return {
      initialComponentData: this.props.componentData,
    };
  }

  componentDidMount() {
    this.setState({ initialComponentData: this.props.componentData });
  }

  onComponentUpdate = () => this.forceUpdate();

  onDoneClick = () => this.props.onSave();

  onCancel = () => this.props.onCancel();

  getDataManager = () => {
    const { updateData } = this.props;
    const store = { set: (_type, data) => updateData(data) } as Store;
    return new CollapsibleList(store, this.props.componentData);
  };

  renderDesktopHeader = () => {
    const { t } = this.props;

    return this.useNewSettingsUi ? (
      <SettingsPanelHeader
        title={t('CollapsibleList_CollapsibleListSettings_Common_Header')}
        onClose={this.onCancel}
      />
    ) : (
      <h3 className={this.styles.collapsibleListModalTitle}>
        {t('CollapsibleList_CollapsibleListSettings_Common_Header')}
      </h3>
    );
  };

  renderMobileHeader = () => {
    const { t, theme } = this.props;

    return (
      <SettingsMobileHeader
        t={t}
        theme={theme}
        onCancel={this.onCancel}
        onSave={this.onDoneClick}
        title={this.useNewSettingsUi && t('CollapsibleList_CollapsibleListSettings_Common_Header')}
        useNewSettingsUi={this.useNewSettingsUi}
      />
    );
  };

  renderSettings = () => {
    const { isMobile, theme, t, experiments = {} } = this.props;

    return (
      <div
        className={classNames(styles.collapsibleListModal_scrollContainer, {
          [styles.collapsibleListModal_mobile]: isMobile,
          [styles.collapsibleListModal_scrollContainer_newUi]: this.useNewSettingsUi,
        })}
      >
        <CollapsibleListSettings
          getDataManager={this.getDataManager}
          theme={theme}
          isMobile={isMobile}
          t={t}
          experiments={experiments}
        />
      </div>
    );
  };

  renderDesktopFooterPanel = () => {
    const { theme, t } = this.props;

    return (
      <SettingsPanelFooter
        fixed
        theme={theme}
        cancel={this.onCancel}
        save={this.onDoneClick}
        t={t}
      />
    );
  };

  render() {
    const { isMobile, languageDir } = this.props;

    return (
      <div
        className={classNames(this.styles.collapsibleListModal, {
          [this.styles.collapsibleListModal_newUi]: this.useNewSettingsUi,
        })}
        data-hook="collapsibleListModal"
        dir={languageDir}
      >
        {isMobile ? this.renderMobileHeader() : this.renderDesktopHeader()}
        {this.renderSettings()}
        {!isMobile && this.renderDesktopFooterPanel()}
      </div>
    );
  }
}

export default CollapsibleListSettingsModal;
