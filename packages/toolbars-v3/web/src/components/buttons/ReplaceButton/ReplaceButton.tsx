/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import cx from 'classnames';
import styles from './ReplaceButton.scss';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import { UploadServiceContext } from 'wix-rich-content-common';
import { withToolbarContext, ModalContext } from 'ricos-context';

type Props = {
  toolbarItem;
  onClick;
  context;
};

const ReplaceButton: FC<Props> = ({ toolbarItem, onClick, context }) => {
  const { isMobile, t } = context || {};
  const uploadContext = useContext(UploadServiceContext);
  const modalService = useContext(ModalContext) || {};
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  const Icon = toolbarItem.presentation?.icon;
  const tooltipKey = toolbarItem.presentation?.tooltip;
  const tooltip = t?.(tooltipKey);
  const node = toolbarItem.attributes.selectedNode;

  return (
    <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
      <div
        className={cx(styles.toggleButtonWrapper, {
          [styles.mobileToggleButtonWrapper]: isMobile,
          [styles.active]: toolbarItem.attributes.active,
          [styles.disabled]: toolbarItem.attributes.disabled,
        })}
        ref={setReferenceElement}
      >
        <div
          onMouseDown={e => e.preventDefault()}
          className={cx(styles.toggleButton, { [styles.mobileToggleButton]: isMobile })}
          role="button"
          onClick={() => onClick({ node, referenceElement, uploadContext, modalService })}
          tabIndex={0}
        >
          <Icon />
        </div>
      </div>
    </Tooltip>
  );
};

export default withToolbarContext(ReplaceButton);
