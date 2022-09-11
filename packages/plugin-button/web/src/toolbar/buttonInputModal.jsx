import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  SettingsPanelFooter,
  Tabs,
  Tab,
  FocusManager,
  BUTTON_SIZE,
  SettingsMobileHeader,
  SettingsPanelHeader,
} from 'wix-rich-content-ui-components';
import { KEYS_CHARCODE } from 'wix-rich-content-editor-common';
import {
  mergeStyles,
  isNewTab,
  ADD_PLUGIN_LINK_BI,
  WEB_ADDRESS_CATEGORY,
} from 'wix-rich-content-common';
import DesignComponent from '../components/design-component';
import SettingsComponent from '../components/settings-component';
import PreviewComponent from '../components/preview-component';
import { settingsTabValue, designTabValue } from '../constants';
import styles from '../../statics/styles/button-input-modal.scss';
import { LINK_BUTTON_TYPE } from '../types';
import classNames from 'classnames';
export default class ButtonInputModal extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    const {
      componentData: { button },
      experiments = {},
    } = this.props;

    this.state = {
      settings: { ...button.settings },
      design: { ...button.design },
      initialComponentData: { ...button },
      isHover: false,
      activeTab: settingsTabValue,
      showLinkPanel: !this.props.settings.isActionButton,
    };

    this.setScrollbarRef = element => {
      this.scrollbarRef = element;
    };
    this.modalsWithEditorCommands = experiments.tiptapEditor?.enabled;
  }

  useNewSettingsUi = !!this.props.experiments?.newSettingsModals?.enabled;

  onSettingsChanged = settings => {
    const { design } = this.state;
    if (!isEqual(settings, this.state.settings)) {
      const {
        componentData: { button },
      } = this.props;
      this.updateComponentData({ button: { ...button, settings, design } });
      this.setState({ settings });
    }
  };

  updateComponentData = data =>
    this.modalsWithEditorCommands
      ? this.props.updateData(data)
      : this.props.pubsub.update('componentData', data);

  onDesignChanged = design => {
    const { settings } = this.state;
    if (this.state.activeTab !== designTabValue) {
      this.setState({ activeTab: designTabValue });
    }
    if (!isEqual(design, this.state.design)) {
      const {
        pubsub,
        componentData: { button },
        updateData,
      } = this.props;
      this.updateComponentData({ button: { ...button, design, settings } });
      this.setState({ design });
    }
  };

  triggerLinkBi = () => {
    const {
      settings: { rel, target, url },
    } = this.state;
    this.props.helpers?.onPluginAction?.(ADD_PLUGIN_LINK_BI, {
      plugin_id: LINK_BUTTON_TYPE,
      params: {
        link: url,
        newTab: isNewTab(target),
        category: WEB_ADDRESS_CATEGORY,
        rel,
      },
    });
  };

  onConfirm = () => {
    const {
      helpers: { closeModal },
      onSave,
    } = this.props;
    const { initialComponentData, design } = this.state;
    if (!initialComponentData.design.color && this.currentColorEqualToConfig()) {
      this.removeColorsFromComponentData(design);
    }
    !this.modalsWithEditorCommands && this.setState({ submitted: true, isOpen: false });
    this.triggerLinkBi();
    this.modalsWithEditorCommands ? onSave() : closeModal();
  };

  currentColorEqualToConfig = () => {
    const { design } = this.state;
    const {
      settings: { colors },
    } = this.props;
    return (
      (design.color === colors?.color1 || design.color === '#FEFDFD') &&
      (design.borderColor === colors?.color8 || design.borderColor === '#0261FF') &&
      (design.background === colors?.color8 || design.background === '#0261FF')
    );
  };

  handleKeyPress = e => {
    if (e.charCode === KEYS_CHARCODE.ENTER) {
      this.modalsWithEditorCommands ? this.props.onSave() : this.onConfirm();
    }
    if (e.charCode === KEYS_CHARCODE.ESCAPE) {
      this.onCancel();
    }
  };

  onCancel = () =>
    this.modalsWithEditorCommands ? this.props.onCancel() : this.onCloseRequested();

  onCloseRequested = () => {
    const {
      componentData,
      pubsub,
      onCloseRequested,
      helpers: { closeModal },
    } = this.props;
    const { initialComponentData } = this.state;
    if (!initialComponentData.design.color) {
      this.removeColorsFromComponentData(initialComponentData.design);
    }
    if (onCloseRequested) {
      onCloseRequested({ ...componentData, button: initialComponentData });
    } else {
      pubsub.update('componentData', { button: initialComponentData });
    }

    this.setState({ isOpen: false });
    closeModal();
  };

  removeColorsFromComponentData = design => {
    const { pubsub, componentData, updateData } = this.props;
    const designToSave = {
      borderWidth: design.borderWidth,
      padding: design.padding,
      borderRadius: design.borderRadius,
    };
    const componentDataToSave = this.modalsWithEditorCommands
      ? componentData
      : pubsub.get('componentData');
    componentDataToSave.button.design = designToSave;
    this.updateComponentData(componentDataToSave);
  };

  handleOnMouseEnterDesign = () => {
    this.setState({ isHover: true, activeTab: designTabValue });
  };

  handleOnMouseLeaveDesign = () => {
    this.setState({ isHover: false });
  };

  handleOnMouseEnterSettings = () => {
    this.setState({ activeTab: settingsTabValue });
  };

  render() {
    const { theme, t, uiSettings, onCancel, isMobile, experiments = {} } = this.props;
    const { showLinkPanel } = this.state;
    const { styles } = this;
    const settingTabLabel = (
      <div className={styles.button_inputModal_settingTab}>
        <div className={styles.button_inputModal_tabTitle}>
          <p className={styles.button_inputModal_tabLabel}>{t('ButtonModal_Settings_Tab')}</p>
        </div>
      </div>
    );
    const designTabLabel = (
      <p className={styles.button_inputModal_tabLabel}>{t('ButtonModal_Design_Tab')}</p>
    );
    const settingsComponent = (
      <SettingsComponent
        t={t}
        theme={theme}
        uiSettings={uiSettings}
        {...this.props}
        onSettingsChange={this.onSettingsChanged.bind(this)}
        settingsObj={this.state.settings}
        onKeyPress={this.handleKeyPress}
        showLinkPanel={showLinkPanel}
      />
    );
    const designComponent = (
      <DesignComponent
        {...this.props}
        theme={theme}
        t={t}
        styles={styles}
        onDesignChange={this.onDesignChanged.bind(this)}
        designObj={this.state.design}
        onKeyPress={this.handleKeyPress}
      />
    );
    let mobileView = null;
    if (isMobile) {
      mobileView = (
        <div>
          <SettingsMobileHeader
            onSave={this.onConfirm}
            onCancel={this.onCancel}
            theme={styles}
            title={this.useNewSettingsUi && t('ButtonModal_Header')}
            t={t}
          />
          <PreviewComponent buttonObj={this.state} {...this.props} />
          <div className={styles.button_inputModal_scroll} ref={this.setScrollbarRef}>
            <div className={styles.button_inputModal_container} data-hook="ButtonInputModal">
              <div className={styles.button_inputModal_header_text}>
                {t('ButtonModal_Settings_Tab')}
              </div>
              {settingsComponent}
            </div>
            <div className={styles.button_inputModal_separator} />
            <div
              className={styles.button_inputModal_design_component_container}
              data-hook="ButtonInputModal"
            >
              <div className={styles.button_inputModal_design_header_text}>
                {t('ButtonModal_Design_Tab')}
              </div>
              {designComponent}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        {isMobile && !this.useNewSettingsUi ? (
          mobileView
        ) : (
          <div
            className={classNames(styles.button_inputModal_container, {
              [styles.button_inputModal_container_newUi]: this.useNewSettingsUi,
            })}
            data-hook="ButtonInputModal"
          >
            {isMobile && this.useNewSettingsUi && (
              <>
                <SettingsMobileHeader
                  onSave={this.onConfirm}
                  onCancel={this.modalsWithEditorCommands ? onCancel : this.onCloseRequested}
                  theme={styles}
                  title={this.useNewSettingsUi && t('ButtonModal_Header')}
                  t={t}
                  useNewSettingsUi={this.useNewSettingsUi}
                />
              </>
            )}
            <div>
              {this.useNewSettingsUi && !isMobile ? (
                <SettingsPanelHeader
                  title={t('ButtonModal_Header')}
                  onClose={this.onCloseRequested}
                />
              ) : (
                !isMobile && (
                  <div
                    role="heading"
                    aria-level={2}
                    aria-labelledby="button_modal_hdr"
                    className={styles.button_inputModal_header}
                  >
                    <div className={styles.button_inputModal_header_text}>
                      {t('ButtonModal_Header')}
                    </div>
                  </div>
                )
              )}
              <FocusManager>
                <div className={styles.button_inputModal_focus_manager}>
                  <Tabs
                    value={this.state.activeTab}
                    theme={this.styles}
                    headersStyle={this.useNewSettingsUi && styles.button_tabs_headers}
                  >
                    <Tab label={settingTabLabel} value={settingsTabValue} theme={this.styles}>
                      <div
                        className={classNames(styles.button_tab_section, {
                          [styles.button_tab_section_newUi]: this.useNewSettingsUi,
                        })}
                        role="button"
                        tabIndex="0"
                        onMouseEnter={this.handleOnMouseEnterSettings}
                      >
                        {settingsComponent}
                      </div>
                    </Tab>
                    <Tab label={designTabLabel} value={designTabValue} theme={this.styles}>
                      <div
                        className={classNames(styles.button_tab_section, {
                          [styles.button_tab_section_newUi]: this.useNewSettingsUi,
                        })}
                      >
                        <Scrollbars
                          ref={this.setScrollbarRef}
                          renderThumbVertical={() =>
                            this.state.isHover ? (
                              <div className={styles.button_inputModal_scrollbar_thumb} />
                            ) : (
                              <div />
                            )
                          }
                          className={styles.button_inputModal_customize_scrollbar_container}
                          onMouseEnter={this.handleOnMouseEnterDesign}
                          onMouseLeave={this.handleOnMouseLeaveDesign}
                        >
                          {designComponent}
                        </Scrollbars>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </FocusManager>
            </div>
            {!isMobile && (
              <SettingsPanelFooter
                fixed
                save={this.onConfirm}
                cancel={this.onCancel}
                theme={styles}
                t={t}
                buttonSize={BUTTON_SIZE.small}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

ButtonInputModal.propTypes = {
  componentData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  settings: PropTypes.object.isRequired,
  uiSettings: PropTypes.object,
  helpers: PropTypes.object,
  experiments: PropTypes.object,
  isMobile: PropTypes.bool,
  updateData: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  pubsub: PropTypes.object,
  onCloseRequested: PropTypes.func,
  languageDir: PropTypes.string,
};
