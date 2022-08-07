/* eslint-disable react/prop-types */
import React from 'react';
import styles from '../panels/styles.scss';
import MobilePanel from '../panels/MobilePanel';
import DesktopPanel from '../panels/DesktopPanel';
import classNames from 'classnames';
import { alignmentsModalData as alignments } from './consts';

const AlignmentPanel = ({ isMobile, t, theme, currentSelect, onSave, closeModal, ...props }) => {
  const panelHeader = t('FormattingToolbar_AlignmentPanelHeader');
  const onChange = (alignment, clickFromKeyboard) => {
    props?.onToolbarButtonClick?.(alignment);
    onSave({ data: alignment, clickFromKeyboard });
    !isMobile && closeModal();
  };

  const panel = isMobile ? (
    <MobilePanel
      {...{
        currentSelect,
        panelHeader,
        options: alignments,
        onChange,
        t,
        onCancel: closeModal,
      }}
    />
  ) : (
    <DesktopPanel
      {...{
        currentSelect,
        options: alignments,
        onChange,
        theme,
        sizeFitContent: true,
        t,
      }}
    />
  );
  return (
    <div
      className={classNames(styles.panel_Container, {
        [styles.mobile_Container]: isMobile,
      })}
    >
      {panel}
    </div>
  );
};

export default AlignmentPanel;
