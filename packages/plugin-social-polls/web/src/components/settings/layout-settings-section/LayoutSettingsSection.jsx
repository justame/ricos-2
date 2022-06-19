import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LTRIcon, RTLIcon } from 'wix-rich-content-plugin-commons';
import {
  SettingsSeparator,
  SelectionList,
  LabeledToggle,
  Label,
  SelectionListItem,
} from 'wix-rich-content-ui-components';
import { mergeStyles } from 'wix-rich-content-common';
import classNames from 'classnames';
import { LAYOUT, DIRECTION } from '../../../defaults';
import { LayoutGridIcon, LayoutListIcon } from '../../../assets/icons';

import styles from './layout-settings-section.scss';

export class LayoutSettingsSection extends Component {
  styles = mergeStyles({ styles, theme: this.props.theme });

  modalsWithEditorCommands = this.props.experiments.tiptapEditor?.enabled;

  useNewSettingsUi = !!this.props.experiments?.newSettingsModals?.enabled;

  updateSettings(layout) {
    const { updateData, componentData } = this.props;
    this.modalsWithEditorCommands
      ? updateData({ layout: { ...componentData.layout, ...layout } })
      : this.props.store.update('componentData', {
          layout,
        });
  }

  handlePollTypeChange = type => {
    const {
      componentData: { layout },
    } = this.props;
    this.modalsWithEditorCommands
      ? this.updateSettings({
          poll: { ...layout.poll, type },
          option: { ...layout.option, enableImage: type === LAYOUT.GRID },
        })
      : this.updateSettings({
          poll: { type },
          option: { enableImage: type === LAYOUT.GRID },
        });

    window.dispatchEvent(new Event('resize'));
  };

  handleDirectionChange = direction => {
    const {
      componentData: { layout },
    } = this.props;
    this.modalsWithEditorCommands
      ? this.updateSettings({
          poll: { ...layout.poll, direction },
        })
      : this.updateSettings({
          poll: { direction },
        });
  };

  renderOption = ({ item, selected }) =>
    this.useNewSettingsUi ? (
      <SelectionListItem icon={<item.icon />} selected={selected} label={item.label} />
    ) : (
      <>
        <item.icon />
        <p className={styles.selectionListOptionLabel}>{item.label}</p>
      </>
    );

  render() {
    const { componentData, t, isMobile } = this.props;

    const { poll, option } = componentData.layout;

    return (
      <section className={this.useNewSettingsUi ? styles.section_newUi : styles.section}>
        {!isMobile && (
          <>
            <p
              className={classNames(styles.title, {
                [styles.title_newUi]: this.useNewSettingsUi,
              })}
            >
              {t('Poll_PollSettings_Tab_Layout_Section_Question_Header')}
            </p>

            <LabeledToggle
              label={t('Poll_PollSettings_Tab_Layout_Section_Question_Image')}
              checked={poll?.enableImage}
              onChange={() =>
                this.modalsWithEditorCommands
                  ? this.updateSettings({ poll: { ...poll, enableImage: !poll?.enableImage } })
                  : this.updateSettings({ poll: { enableImage: !poll?.enableImage } })
              }
              theme={this.props.theme}
              style={this.useNewSettingsUi ? { paddingTop: 20 } : {}}
            />

            <SettingsSeparator top bottom />
          </>
        )}

        <p className={styles.title}>{t('Poll_PollSettings_Tab_Layout_Section_Answers_Header')}</p>
        <p className={styles.subtitle}>
          {t('Poll_PollSettings_Tab_Layout_Section_Answers_Layout')}
        </p>

        <SelectionList
          theme={this.styles}
          dataSource={[
            {
              value: LAYOUT.LIST,
              label: t('Poll_PollSettings_Tab_Layout_Section_Answers_Layout_List'),
              icon: LayoutListIcon,
            },
            {
              value: LAYOUT.GRID,
              label: t('Poll_PollSettings_Tab_Layout_Section_Answers_Layout_Grid'),
              icon: LayoutGridIcon,
            },
          ]}
          renderItem={this.renderOption}
          value={poll?.type}
          onChange={this.handlePollTypeChange}
          className={styles.layout_selector}
          useNewSettingsUi={this.useNewSettingsUi}
        />

        {!isMobile && (
          <LabeledToggle
            label={t('Poll_PollSettings_Tab_Layout_Section_Answers_Image')}
            checked={option?.enableImage}
            onChange={() =>
              this.modalsWithEditorCommands
                ? this.updateSettings({ option: { ...option, enableImage: !option?.enableImage } })
                : this.updateSettings({ option: { enableImage: !option?.enableImage } })
            }
            theme={this.props.theme}
            style={this.useNewSettingsUi ? { paddingTop: 20 } : {}}
          />
        )}

        <SettingsSeparator top bottom />

        <Label
          label={t('Poll_PollSettings_Tab_Layout_Section_TextDirection_Header')}
          tooltipText={t('Poll_PollSettings_Tab_Layout_Section_TextDirection_Header_Tooltip')}
          isMobile={isMobile}
          style={this.useNewSettingsUi ? { fontSize: '16px' } : {}}
        />

        <SelectionList
          theme={this.styles}
          dataSource={[
            {
              value: DIRECTION.LTR,
              label: t('Poll_PollSettings_Tab_Layout_Section_TextDirection_LTR'),
              icon: LTRIcon,
            },
            {
              value: DIRECTION.RTL,
              label: t('Poll_PollSettings_Tab_Layout_Section_TextDirection_RTL'),
              icon: RTLIcon,
            },
          ]}
          renderItem={this.renderOption}
          value={poll?.direction}
          onChange={this.handleDirectionChange}
          className={styles.layout_selector}
          useNewSettingsUi={this.useNewSettingsUi}
        />
      </section>
    );
  }
}

LayoutSettingsSection.propTypes = {
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
  componentData: PropTypes.object.isRequired,
  experiments: PropTypes.object,
  updateData: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
};
