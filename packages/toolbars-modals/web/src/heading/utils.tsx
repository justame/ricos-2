import React from 'react';
import { hasStyleChanges } from '../utils';
import styles from './CustomHeadingButton.scss';

export const headingsMap = {
  'header-one': 'Heading 1',
  'header-two': 'Heading 2',
  'header-three': 'Heading 3',
  'header-four': 'Heading 4',
  'header-five': 'Heading 5',
  'header-six': 'Heading 6',
  unstyled: 'P',
};

const findOsName = () => {
  if (navigator.userAgent.indexOf('Win') !== -1) return 'Windows';
  if (navigator.userAgent.indexOf('Mac') !== -1) return 'MacOS';
  return null;
};

const headingShortcuts = {
  MacOS: number => ` (⌘⌥${number})`,
  Windows: number => ` (Ctrl+Alt+${number})`,
};

export const translateHeading = (option = 'P', t, shouldAddShortcut = false) => {
  const number = parseInt(option.slice(-1)) ? option.slice(-1) : undefined;
  const osName = findOsName();
  const shortcut = shouldAddShortcut && osName ? headingShortcuts[osName](number || 0) : undefined;
  return option === 'P'
    ? t('FormattingToolbar_TextStyle_Paragraph', shortcut && { shortcut })
    : t('FormattingToolbar_TextStyle_Heading', shortcut ? { number, shortcut } : { number });
};

export const getCustomHeadingsLabel = (selectedHeading, t, editorCommands) => {
  let label = translateHeading(headingsMap[selectedHeading], t);
  const inlineStyles = editorCommands.getInlineStylesInSelection() || {};
  if (hasStyleChanges(selectedHeading, inlineStyles, editorCommands.getDocumentStyle())) {
    label = (
      <>
        {label}
        <span className={styles.toolbarLabelUpdate}>*</span>
      </>
    );
  }
  return label;
};
