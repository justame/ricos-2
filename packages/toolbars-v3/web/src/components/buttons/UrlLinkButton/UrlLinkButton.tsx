import React from 'react';
import { parseLink } from 'ricos-content/libs/nodeUtils';
import styles from './UrlLinkButton.scss';
import { normalizeUrl } from 'wix-rich-content-common';

const UrlLinkButton = ({ toolbarItem, dataHook }: { toolbarItem; dataHook?: string }) => {
  const selectedUrlLinkData = toolbarItem.attributes.selectedUrlLinkData;
  const { url = '', rel = '', target = '_self' } = parseLink(selectedUrlLinkData);
  const href = normalizeUrl(url);
  return (
    <div className={styles.toolbarUrlContainer}>
      <a
        data-hook={dataHook}
        href={href}
        rel={rel}
        target={target}
        className={styles.toolbarUrl}
        onMouseDown={event => event.preventDefault()}
      >
        {url}
      </a>
    </div>
  );
};

export default UrlLinkButton;
