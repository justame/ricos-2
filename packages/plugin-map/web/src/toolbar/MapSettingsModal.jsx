import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { mergeStyles } from 'wix-rich-content-common';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from 'react-google-places-suggest';
import styles from '../../statics/styles/map-settings-modal.scss';
import {
  LabeledToggle,
  SettingsSection,
  TextInput,
  SettingsPanelFooter,
  SearchIcon,
  SettingsMobileHeader,
  SettingsPanelHeader,
  InputWithLabel,
} from 'wix-rich-content-ui-components';
import { Scrollbars } from 'react-custom-scrollbars';
import classNames from 'classnames';

export class MapSettingsModal extends Component {
  constructor(props) {
    super(props);
    const { componentData, experiments } = this.props;

    this.styles = mergeStyles({ styles, theme: props.theme });

    this.state = {
      locationSearchPhrase: '',
      address: componentData.mapSettings.address,
      lat: componentData.mapSettings.lat,
      lng: componentData.mapSettings.lng,
      mode: componentData.mapSettings.mode,
      isMarkerShown: componentData.mapSettings.isMarkerShown,
      isZoomControlShown: componentData.mapSettings.isZoomControlShown,
      isStreetViewControlShown: componentData.mapSettings.isStreetViewControlShown,
      isDraggingAllowed: componentData.mapSettings.isDraggingAllowed,
      isViewControlShown: componentData.mapSettings.isViewControlShown,
      locationDisplayName: componentData.mapSettings.locationDisplayName,
      isLocationInputAlreadyFocused: false,
      mapSettings: { ...componentData.mapSettings },
    };
    this.modalsWithEditorCommands = experiments.tiptapEditor?.enabled;
  }

  useNewSettingsUi = !!this.props.experiments?.newSettingsModals?.enabled;

  updateComponentData = data => {
    const { updateData, componentData } = this.props;
    this.modalsWithEditorCommands
      ? updateData({ mapSettings: { ...componentData.mapSettings, ...data } })
      : this.setState({ ...data });
  };

  onLocationInputChange = value => {
    this.setState({ locationSearchPhrase: value });
    this.updateComponentData({ address: value });
  };

  onLocationSuggestSelect = (geocodedPrediction, originalPrediction) => {
    this.setState({ locationSearchPhrase: '' });
    this.updateComponentData({
      address: originalPrediction.description,
      locationDisplayName: originalPrediction.description,
      lat: geocodedPrediction.geometry.location.lat(),
      lng: geocodedPrediction.geometry.location.lng(),
    });
  };

  onSaveBtnClick = () => {
    const { componentData, onConfirm, pubsub, helpers } = this.props;
    const newComponentData = {
      mapSettings: {
        address: this.state.address,
        locationDisplayName: this.state.locationDisplayName,
        lat: this.state.lat,
        lng: this.state.lng,
        mode: this.state.mode,
        isMarkerShown: this.state.isMarkerShown,
        isZoomControlShown: this.state.isZoomControlShown,
        isStreetViewControlShown: this.state.isStreetViewControlShown,
        isViewControlShown: this.state.isViewControlShown,
        isDraggingAllowed: this.state.isDraggingAllowed,
      },
    };

    if (onConfirm) {
      onConfirm({ ...componentData, ...newComponentData });
    } else {
      pubsub.update('componentData', { ...newComponentData });
    }

    helpers.openModal(data => pubsub.update('componentData', { metadata: { ...data } }));
    helpers.closeModal();
  };

  onSave = () => {
    this.modalsWithEditorCommands ? this.props.onSave() : this.onSaveBtnClick();
  };

  onCancel = () => {
    this.modalsWithEditorCommands ? this.props.onCancel() : this.props.helpers.closeModal();
  };

  toggleState = key => () => {
    this.modalsWithEditorCommands
      ? this.updateComponentData({ [key]: !this.props.componentData.mapSettings[key] })
      : this.setState(prevState => ({
          [key]: !prevState[key],
        }));
  };

  renderToggle = ({ toggleKey, labelKey, style }) => (
    <LabeledToggle
      key={labelKey}
      theme={this.props.theme}
      checked={
        this.modalsWithEditorCommands
          ? this.props.componentData.mapSettings[toggleKey]
          : this.state[toggleKey]
      }
      label={this.props.t(labelKey)}
      onChange={this.toggleState(toggleKey)}
      style={style}
    />
  );

  toggleData = [
    {
      toggleKey: 'isViewControlShown',
      labelKey: 'MapSettings_MapOption_Show_View_Control_Label',
      style: this.useNewSettingsUi ? { paddingTop: 0 } : {},
    },
    {
      toggleKey: 'isMarkerShown',
      labelKey: 'MapSettings_MapOption_Show_Marker_Label',
    },
    {
      toggleKey: 'isZoomControlShown',
      labelKey: 'MapSettings_MapOption_Show_Zoom_Label',
    },
    {
      toggleKey: 'isStreetViewControlShown',
      labelKey: 'MapSettings_MapOption_Show_Street_View_Label',
    },
    {
      toggleKey: 'isDraggingAllowed',
      labelKey: 'MapSettings_MapOption_Allow_Dragging_Label',
    },
  ];

  renderSettingsSections() {
    const { theme, t, isMobile, componentData } = this.props;
    const { locationSearchPhrase } = this.state;
    const { googleMapApiKey } = this.props.settings;
    const address = this.modalsWithEditorCommands
      ? componentData.mapSettings.address
      : this.state.address;

    const locationDisplayName = this.modalsWithEditorCommands
      ? componentData.mapSettings.locationDisplayName
      : this.state.locationDisplayName;

    return (
      <div
        className={classNames(
          this.styles.map_settings_modal_settings,
          this.styles.map_settings_modal_main_content_block,
          {
            [this.styles.map_settings_modal_main_content_block_newUi]: this.useNewSettingsUi,
          }
        )}
      >
        <SettingsSection
          theme={theme}
          className={classNames(this.styles.map_settings_modal_location_input_settings_section, {
            [this.styles.settings_section_newUi]: this.useNewSettingsUi,
          })}
          ariaProps={{ 'aria-label': 'location', role: 'region' }}
        >
          {!this.useNewSettingsUi && (
            <div className={this.styles.map_settings_modal_text_input_label}>
              <label htmlFor="location-input">{t('MapSettings_Location_Input_Label')}</label>
            </div>
          )}
          <ReactGoogleMapLoader
            params={{
              key: googleMapApiKey,
              libraries: 'places,geocode',
            }}
            render={googleMaps =>
              googleMaps && (
                <div>
                  <ReactGooglePlacesSuggest
                    autocompletionRequest={{ input: locationSearchPhrase }}
                    googleMaps={googleMaps}
                    onSelectSuggest={this.onLocationSuggestSelect}
                    customRender={prediction =>
                      prediction ? (
                        <p className={this.styles.map_settings_modal_location_suggestion}>
                          {prediction.description}
                        </p>
                      ) : (
                        <p className={this.styles.map_settings_modal_location_suggestion}>
                          {t('MapSettings_Location_Suggestion_Input_No_Results_Found')}
                        </p>
                      )
                    }
                  >
                    <div className={this.styles.map_settings_modal_search_icon_wrapper}>
                      <div className={this.styles.map_settings_modal_search_icon}>
                        <SearchIcon />
                      </div>
                      {this.useNewSettingsUi ? (
                        <InputWithLabel
                          label={t('MapSettings_Location_Input_Label')}
                          placeholder={t('MapSettings_Location_Input_Placeholder')}
                          id="location-input"
                          value={address}
                          onChange={this.onLocationInputChange}
                          autoComplete="off"
                          onLoad={() => this.setState({ isLocationInputAlreadyFocused: true })}
                          tabIndex={0}
                        />
                      ) : (
                        <TextInput
                          tabIndex="0"
                          theme={this.styles}
                          type="option"
                          placeholder={t('MapSettings_Location_Input_Placeholder')}
                          value={address}
                          id="location-input"
                          autoComplete="off"
                          onChange={this.onLocationInputChange}
                          inputRef={ref => {
                            // TODO: since this is a common logic, move it to the TextInput component, and encapsulate it in a prop
                            if (ref !== null && !this.state.isLocationInputAlreadyFocused) {
                              ref.focus();
                              this.setState({ isLocationInputAlreadyFocused: true });
                            }
                          }}
                        />
                      )}
                    </div>
                  </ReactGooglePlacesSuggest>
                </div>
              )
            }
          />
        </SettingsSection>

        <SettingsSection
          theme={theme}
          className={this.styles.map_settings_modal_location_display_name_settings_section}
          ariaProps={{ 'aria-label': 'location', role: 'region' }}
        >
          {this.useNewSettingsUi ? (
            <InputWithLabel
              label={t('MapSettings_Location_Display_Name')}
              id="location-display-name"
              value={locationDisplayName}
              onChange={locationDisplayName => this.updateComponentData({ locationDisplayName })}
              theme={this.styles}
              autoComplete="off"
            />
          ) : (
            <>
              <div className={this.styles.map_settings_modal_text_input_label}>
                <label htmlFor="location-display-name">
                  {t('MapSettings_Location_Display_Name')}
                </label>
              </div>
              <TextInput
                type="text"
                id="location-display-name"
                value={locationDisplayName}
                onChange={locationDisplayName => this.updateComponentData({ locationDisplayName })}
                theme={this.styles}
                autoComplete="off"
              />
            </>
          )}
        </SettingsSection>

        {(!isMobile || this.useNewSettingsUi) && (
          <div
            className={classNames(this.styles.map_settings_modal_divider_wrapper, {
              [this.styles.map_settings_modal_divider_newUi]: this.useNewSettingsUi,
            })}
          >
            <div className={this.styles.map_settings_modal_divider} />
          </div>
        )}

        <SettingsSection
          theme={theme}
          className={this.styles.map_settings_modal_checkbox_section}
          ariaProps={{ 'aria-label': 'ckeckboxes', role: 'region' }}
        >
          <div className={this.styles.map_settings_modal_map_options}>
            {!this.useNewSettingsUi && (
              <p className={this.styles.map_settings_modal_map_options_sub_header}>
                {t('MapSettings_MapOption_SubHeader')}
              </p>
            )}
            {this.toggleData.map(toggle => this.renderToggle(toggle))}
          </div>
        </SettingsSection>
      </div>
    );
  }

  render() {
    const { t, isMobile, languageDir, theme, experiments = {} } = this.props;

    const wrapWithScrollBars = jsx => (
      <Scrollbars
        renderThumbVertical={() => (
          <div className={this.styles.map_settings_modal_scrollbar_thumb} />
        )}
        className={this.styles.map_settings_modal_scrollbar_container}
      >
        {jsx}
      </Scrollbars>
    );

    return (
      <div dir={languageDir}>
        {isMobile && (
          <SettingsMobileHeader
            onSave={this.onSave}
            onCancel={this.onCancel}
            theme={theme}
            t={t}
            title={this.useNewSettingsUi && t('MapSettings_Title')}
            useNewSettingsUi={this.useNewSettingsUi}
          />
        )}

        <div className={this.styles.map_settings_modal_settings_container} data-hook="mapSettings">
          {!isMobile && this.useNewSettingsUi ? (
            <SettingsPanelHeader title={t('MapSettings_Title')} onClose={this.onCancel} />
          ) : (
            !isMobile && (
              <div
                className={classNames(
                  this.styles.map_settings_modal_title_container,
                  this.styles.map_settings_modal_main_content_block
                )}
              >
                <h3 className={this.styles.map_settings_modal_title}>{t('MapSettings_Title')}</h3>
              </div>
            )
          )}

          {isMobile
            ? this.renderSettingsSections()
            : wrapWithScrollBars(this.renderSettingsSections())}

          {!isMobile && (
            <SettingsPanelFooter
              fixed
              cancel={this.onCancel}
              save={this.onSave}
              theme={theme}
              t={t}
            />
          )}
        </div>
      </div>
    );
  }
}

MapSettingsModal.propTypes = {
  pubsub: PropTypes.object,
  helpers: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  onConfirm: PropTypes.func,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  isMobile: PropTypes.bool,
  languageDir: PropTypes.string,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  updateData: PropTypes.func,
  experiments: PropTypes.object,
};
