import React, { Component } from 'react';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import type { FileUploadSettingsProps, FileUploadSettingsState } from '../types';
import {
  SettingsPanelFooter,
  SettingsPanelHeader,
  SettingsSection,
  LabeledToggle,
  SettingsMobileHeader,
  SettingsSeparator,
  SelectionList,
  SelectionListItem,
} from 'wix-rich-content-ui-components';
import styles from '../../statics/styles/file-upload-settings.scss';
import { PDF_OPTIONS, PDF_CUSTOMIZATIONS } from '../pdfViewer';
import { FullViewerIcon, MiniViewerIcon } from '../icons';

class FileUploadSettings extends Component<FileUploadSettingsProps, FileUploadSettingsState> {
  initialState: FileUploadSettingsState;

  modalsWithEditorCommands: boolean;

  styles!: Record<string, string>;

  constructor(props) {
    super(props);
    this.state = this.propsToState(props);
    this.initialState = { ...this.state };
    const { theme, experiments = {} } = props;
    this.styles = mergeStyles({ styles, theme });
    this.modalsWithEditorCommands = !!experiments.tiptapEditor?.enabled;
  }

  propsToState(props) {
    const {
      pdfSettings: {
        viewMode = PDF_OPTIONS.NONE,
        disableDownload = true,
        disablePrint = true,
      } = {},
    } = props.componentData;

    return {
      pdfView: viewMode,
      showPrintPDF: !disablePrint,
      showDownloadPDF: !disableDownload,
    };
  }

  renderToggle = ({ toggleKey, labelKey, dataHook, isChecked, onChange }) => {
    const { theme, t } = this.props;
    return (
      <div key={toggleKey}>
        <LabeledToggle
          theme={theme}
          checked={isChecked()}
          label={t(labelKey)}
          onChange={onChange}
          dataHook={dataHook}
        />
      </div>
    );
  };

  pdfViewerToggleData = {
    toggleKey: 'isPDFViewerEnabled',
    labelKey: 'FileUploadPlugin_Settings_EnablePDFViewer_Label',
    dataHook: 'fileUploadPDFViewerToggle',
    isChecked: () => {
      const { viewMode = PDF_OPTIONS.NONE } = this.props.componentData.pdfSettings || {};
      return this.modalsWithEditorCommands
        ? viewMode !== PDF_OPTIONS.NONE
        : this.state.pdfView !== PDF_OPTIONS.NONE;
    },
    onChange: () => {
      const pdfSettings = this.props.componentData.pdfSettings;
      const { viewMode: currentViewMode = PDF_OPTIONS.NONE } = pdfSettings || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viewMode: any =
        currentViewMode === PDF_OPTIONS.NONE ? PDF_OPTIONS.FULL : PDF_OPTIONS.NONE;
      if (this.modalsWithEditorCommands) {
        this.props.updateData({
          pdfSettings: {
            ...pdfSettings,
            viewMode,
          },
        });
      } else {
        this.setState(({ pdfView }) => {
          return pdfView === PDF_OPTIONS.NONE
            ? { pdfView: PDF_OPTIONS.FULL }
            : { pdfView: PDF_OPTIONS.NONE };
        });
      }
    },
  };

  toggleData = [
    {
      toggleKey: PDF_CUSTOMIZATIONS.DOWNLOAD,
      labelKey: 'FileUploadPlugin_Settings_ShowDownloadPDF_Label',
      dataHook: 'fileUploadShowDownloadPDFToggle',
      isChecked: () => {
        const {
          componentData: { pdfSettings },
        } = this.props;
        return this.modalsWithEditorCommands && pdfSettings
          ? !pdfSettings[PDF_CUSTOMIZATIONS.DOWNLOAD]
          : this.state.showDownloadPDF;
      },
      onChange: () => {
        const {
          componentData: { pdfSettings },
        } = this.props;
        if (this.modalsWithEditorCommands && pdfSettings) {
          this.props.updateData({
            pdfSettings: {
              ...pdfSettings,
              [PDF_CUSTOMIZATIONS.DOWNLOAD]: !pdfSettings[PDF_CUSTOMIZATIONS.DOWNLOAD],
            },
          });
        } else {
          this.setState(({ showDownloadPDF }) => {
            return { showDownloadPDF: !showDownloadPDF };
          });
        }
      },
    },
    {
      toggleKey: PDF_CUSTOMIZATIONS.PRINT,
      labelKey: 'FileUploadPlugin_Settings_ShowPrintPDF_Label',
      dataHook: 'fileUploadShowPrintPDFToggle',
      isChecked: () => {
        const {
          componentData: { pdfSettings },
        } = this.props;
        return this.modalsWithEditorCommands && pdfSettings
          ? !pdfSettings[PDF_CUSTOMIZATIONS.PRINT]
          : this.state.showPrintPDF;
      },
      onChange: () => {
        const {
          componentData: { pdfSettings },
        } = this.props;
        if (this.modalsWithEditorCommands && pdfSettings) {
          this.props.updateData({
            pdfSettings: {
              ...pdfSettings,
              [PDF_CUSTOMIZATIONS.PRINT]: !pdfSettings[PDF_CUSTOMIZATIONS.PRINT],
            },
          });
        } else {
          this.setState(({ showPrintPDF }) => {
            return { showPrintPDF: !showPrintPDF };
          });
        }
      },
    },
  ];

  revertComponentData = () => {
    const { componentData, helpers, pubsub } = this.props;
    if (this.initialState) {
      const { pdfView, showDownloadPDF, showPrintPDF } = this.initialState;
      const initialComponentData = {
        ...componentData,
        pdfSettings: {
          viewMode: pdfView,
          disableDownload: !showDownloadPDF,
          disablePrint: !showPrintPDF,
        },
      };
      pubsub.update('componentData', initialComponentData);
      this.setState({ ...this.initialState });
    }
    helpers?.closeModal?.();
  };

  onCancel = () => {
    this.modalsWithEditorCommands ? this.props.onCancel() : this.revertComponentData();
  };

  onSave = () => {
    this.modalsWithEditorCommands ? this.props.onSave() : this.onDoneClick();
  };

  onDoneClick = () => {
    const { helpers, componentData, pubsub } = this.props;
    const { pdfView, showDownloadPDF, showPrintPDF } = this.state;
    const newComponentData = {
      ...componentData,
      pdfSettings: {
        viewMode: pdfView,
        disableDownload: !showDownloadPDF,
        disablePrint: !showPrintPDF,
      },
    };
    pubsub.update('componentData', newComponentData);

    helpers?.closeModal?.();
  };

  renderOption = ({ item, selected }) => (
    <SelectionListItem label={item.name} selected={selected} icon={<item.icon />} />
  );

  getSelectionListOptions = t => {
    return [
      {
        option: PDF_OPTIONS.FULL,
        name: t('FileUploadPlugin_Settings_FullPDFViewer_Label'),
        icon: FullViewerIcon,
        dataHook: `PDFOptions_${PDF_OPTIONS.FULL}`,
        subText: t('FileUploadPlugin_Settings_FullPDFViewer_SubText'),
      },
      {
        option: PDF_OPTIONS.MINI,
        name: t('FileUploadPlugin_Settings_MiniPDFViewer_Label'),
        icon: MiniViewerIcon,
        dataHook: `PDFOptions_${PDF_OPTIONS.MINI}`,
        subText: t('FileUploadPlugin_Settings_MiniPDFViewer_SubText'),
      },
    ];
  };

  dataMapper = ({ option }) => ({ value: option });

  onPDFViewModeChange = option => {
    if (this.modalsWithEditorCommands) {
      const pdfSettings = this.props.componentData.pdfSettings;
      this.props.updateData({ pdfSettings: { ...pdfSettings, viewMode: option } });
    } else {
      this.setState({ pdfView: option });
    }
  };

  render() {
    const {
      theme,
      t,
      isMobile,
      languageDir,
      componentData: { pdfSettings },
    } = this.props;
    const componentDataPDFView = pdfSettings?.viewMode || PDF_OPTIONS.NONE;
    const { pdfView } = this.state;
    const selectedOption = this.modalsWithEditorCommands ? componentDataPDFView : pdfView;
    return (
      <div
        className={this.styles.fileUploadSettings}
        data-hook="fileUploadSettings"
        dir={languageDir}
      >
        {isMobile ? (
          <SettingsMobileHeader
            theme={theme}
            onCancel={this.onCancel}
            onSave={this.onSave}
            t={t}
            title={t('FileUploadSettings_Header')}
          />
        ) : (
          <SettingsPanelHeader
            title={t('FileUploadSettings_Header')}
            onClose={this.revertComponentData}
          />
        )}
        <div
          className={classNames(styles.fileUploadSettings_scrollContainer, {
            [styles.fileUploadSettings_mobile]: isMobile,
          })}
        >
          <div className={this.styles.settingsBodyWrapper}>
            <SettingsSection
              theme={theme}
              ariaProps={{ 'aria-label': 'enable pdf viewer', role: 'region' }}
            >
              <div className={this.styles.fileUploadSettingsLabel}>
                {this.renderToggle(this.pdfViewerToggleData)}
              </div>
            </SettingsSection>
            {selectedOption !== PDF_OPTIONS.NONE ? (
              <>
                <SettingsSeparator top bottom />
                <SettingsSection
                  headerText={t('FileUploadPlugin_Settings_PDFDisplayOptions')}
                  theme={theme}
                  ariaProps={{ 'aria-label': 'pdf viewer modes', role: 'region' }}
                >
                  <SelectionList
                    theme={theme}
                    className={styles.pdfViewModeSelector_grid}
                    dataSource={this.getSelectionListOptions(t)}
                    dataMapper={this.dataMapper}
                    renderItem={this.renderOption}
                    value={selectedOption}
                    onChange={this.onPDFViewModeChange}
                    optionClassName={styles.pdfViewModeSelector_option}
                    useNewSettingsUi
                  />
                </SettingsSection>
                <SettingsSeparator top />
                <SettingsSection
                  theme={theme}
                  ariaProps={{ 'aria-label': 'pdf viewer customizations', role: 'region' }}
                >
                  <div className={this.styles.fileUploadSettingsLabel}>
                    {this.toggleData.map(toggle => this.renderToggle(toggle))}
                  </div>
                </SettingsSection>
              </>
            ) : null}
          </div>
        </div>
        {!isMobile && (
          <SettingsPanelFooter
            fixed
            theme={theme}
            cancel={this.onCancel}
            save={this.onSave}
            t={t}
          />
        )}
      </div>
    );
  }
}

export default FileUploadSettings;
