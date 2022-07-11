import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import ReactModal from 'react-modal';

import {
  Tabs,
  Tab,
  SettingsPanelFooter,
  SettingsPanelHeader,
  FocusManager,
  SettingsMobileHeader,
  Button,
} from 'wix-rich-content-ui-components';
import { mergeStyles, GlobalContext } from 'wix-rich-content-common';

import { PollContextProvider } from '../poll-context';
import { RCEHelpersContext } from '../rce-helpers-context';

import { TABS } from './constants';

import { DesignSettingsSection } from './design-settings-section';
import { LayoutSettingsSection } from './layout-settings-section';
import { PollSettingsSection } from './poll-settings-section';
import { EditPollSection } from './edit-poll-section';
import { PollViewer } from '../../PollViewer';

import styles from './poll-settings-modal.scss';

export class SettingsModal extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    componentData: PropTypes.object.isRequired,
    helpers: PropTypes.object.isRequired,
    pubsub: PropTypes.any.isRequired,
    isMobile: PropTypes.bool,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func,
    relValue: PropTypes.string,
    anchorTarget: PropTypes.string,
    settings: PropTypes.object.isRequired,
    experiments: PropTypes.object,
    updateData: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    activeTab: TABS.LAYOUT,
  };

  modalsWithEditorCommands = this.props.experiments?.tiptapEditor?.enabled;

  state = {
    activeTab: this.props.activeTab,
    componentData: this.props.componentData,
    $container: React.createRef(),
    isPreviewOpen: false,
  };

  styles = mergeStyles({ styles, theme: this.props.theme });

  static contextType = GlobalContext;

  setPoll = poll => {
    const { pubsub, updateData } = this.props;
    if (this.modalsWithEditorCommands) {
      updateData({ poll });
    } else {
      const componentData = pubsub.store.get('componentData');

      pubsub.store.set('componentData', {
        ...componentData,
        poll,
      });
    }
  };

  componentDidCatch() {}

  handleTabChange = activeTab => this.setState({ activeTab });

  getContainer = () => this.state.$container.current;

  closePreview = () => this.setState({ isPreviewOpen: false });

  openPreview = () => this.setState({ isPreviewOpen: true });

  restoreChanges = () => {
    if (!this.modalsWithEditorCommands) {
      const { pubsub, helpers } = this.props;
      const { componentData } = this.state;

      pubsub.set('componentData', componentData);

      helpers.closeModal();
    }
  };

  componentDidMount() {
    !this.modalsWithEditorCommands &&
      this.props.pubsub?.subscribe('componentData', this.onComponentUpdate);
  }

  componentWillUnmount() {
    !!this.modalsWithEditorCommands &&
      this.props.pubsub?.unsubscribe('componentData', this.onComponentUpdate);
  }

  onComponentUpdate = () => this.forceUpdate();

  render() {
    const { activeTab, $container, isPreviewOpen } = this.state;
    const {
      pubsub,
      helpers,
      t,
      theme,
      isMobile,
      settings,
      updateData,
      onCancel,
      onSave,
      experiments = {},
    } = this.props;
    const { languageDir } = this.context;

    const componentData = this.modalsWithEditorCommands
      ? this.props.componentData
      : pubsub.store.get('componentData');

    const useNewSettingsUi = experiments?.newSettingsModals?.enabled;

    return (
      <div ref={$container} className={this.styles.settings_container}>
        <FocusManager dir={languageDir}>
          {isMobile ? (
            <SettingsMobileHeader
              onSave={this.modalsWithEditorCommands ? onSave : helpers.closeModal}
              onCancel={this.modalsWithEditorCommands ? onCancel : this.restoreChanges}
              theme={styles}
              title={useNewSettingsUi && t('Poll_PollSettings_Common_Header')}
              t={t}
              useNewSettingsUi={useNewSettingsUi}
            >
              {!useNewSettingsUi && (
                <div className={this.styles.preview_button}>
                  <Button borderless isMobile onClick={this.openPreview}>
                    {t('Poll_FormatToolbar_Preview_Tooltip')}
                  </Button>
                </div>
              )}
            </SettingsMobileHeader>
          ) : useNewSettingsUi ? (
            <SettingsPanelHeader
              title={t('Poll_PollSettings_Common_Header')}
              onClose={this.modalsWithEditorCommands ? onCancel : this.restoreChanges}
            />
          ) : (
            <div className={this.styles.header}>
              <h3 className={this.styles.title}>{t('Poll_PollSettings_Common_Header')}</h3>
            </div>
          )}

          {activeTab === TABS.EDIT ? (
            <RCEHelpersContext.Provider
              value={{
                layout: componentData.layout,
                design: componentData.design,
                helpers,
                theme,
                t,
                isMobile,
              }}
            >
              <PollContextProvider
                settings={settings}
                poll={componentData.poll}
                setPoll={this.setPoll}
                t={t}
                experiments={experiments}
              >
                <EditPollSection
                  store={pubsub?.store}
                  updateData={updateData}
                  layout={componentData.layout}
                  experiments={experiments}
                />
              </PollContextProvider>
            </RCEHelpersContext.Provider>
          ) : (
            <Tabs
              value={activeTab}
              theme={theme}
              headersStyle={useNewSettingsUi && styles.poll_tab_headers}
              onTabSelected={this.handleTabChange}
            >
              <Tab
                label={t('Poll_PollSettings_Tab_Layout_TabName')}
                value={TABS.LAYOUT}
                theme={theme}
              >
                <LayoutSettingsSection
                  theme={theme}
                  updateData={updateData}
                  store={pubsub?.store}
                  componentData={componentData}
                  t={t}
                  isMobile={isMobile}
                  experiments={experiments}
                />
              </Tab>
              <Tab
                label={t('Poll_PollSettings_Tab_Design_TabName')}
                value={TABS.DESIGN}
                theme={theme}
              >
                <DesignSettingsSection
                  theme={theme}
                  updateData={updateData}
                  store={pubsub?.store}
                  componentData={componentData}
                  t={t}
                  languageDir={languageDir}
                  experiments={experiments}
                />
              </Tab>
              <Tab
                label={t('Poll_PollSettings_Tab_Settings_TabName')}
                value={TABS.SETTINGS}
                theme={theme}
              >
                <PollSettingsSection
                  theme={theme}
                  updateData={updateData}
                  store={pubsub?.store}
                  componentData={componentData}
                  t={t}
                  settings={settings}
                  experiments={experiments}
                />
              </Tab>
            </Tabs>
          )}

          {!isMobile && (
            <SettingsPanelFooter
              fixed
              cancel={this.modalsWithEditorCommands ? onCancel : this.restoreChanges}
              save={this.modalsWithEditorCommands ? onSave : helpers.closeModal}
              theme={this.props.theme}
              t={t}
            />
          )}

          {isMobile && $container.current && isPreviewOpen && (
            <ReactModal
              isOpen={isPreviewOpen}
              onRequestClose={this.closePreview}
              parentSelector={this.getContainer}
              className={cls(this.styles.modal)}
              overlayClassName={cls(this.styles.overlay)}
            >
              <PollViewer
                isMobile
                settings={{
                  isPreview: true,
                  preventInteraction: true,
                }}
                componentData={componentData}
                onRequestClose={this.closePreview}
                theme={theme}
                t={t}
                experiments={experiments}
              />
              &nbsp;
              <button
                className={cls(
                  this.styles.poll_header_button,
                  this.styles.poll_header_button_primary
                )}
                onClick={this.closePreview}
              >
                {t('Poll_Preview_Close_CTA')}
              </button>
            </ReactModal>
          )}
        </FocusManager>
      </div>
    );
  }
}
