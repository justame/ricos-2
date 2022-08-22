/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import cx from 'classnames';
import styles from '../UrlLinkButton/UrlLinkButton.scss';
import { withToolbarContext } from 'ricos-context';

const onClick = (event, toolbarItem, anchor) => {
  event.preventDefault();
  toolbarItem.commands?.scrollToAnchor(anchor);
};

const AnchorLinkButton = ({ toolbarItem, context, dataHook }) => {
  const { t } = context || {};
  const selectedAnchor = toolbarItem.attributes.selectedAnchorLinkData;
  return (
    <div className={styles.toolbarUrlContainer}>
      <button
        data-hook={dataHook}
        className={cx(styles.toolbarUrl, styles.toolbarUrlAnchor)}
        onClick={e => onClick(e, toolbarItem, selectedAnchor)}
      >
        {t('LinkTo_Toolbar_GoTo')}
      </button>
    </div>
  );
};

export default withToolbarContext(AnchorLinkButton);
