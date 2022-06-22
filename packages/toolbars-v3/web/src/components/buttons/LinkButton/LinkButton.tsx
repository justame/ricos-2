/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from 'wix-rich-content-editor-common';
import cx from 'classnames';
import styles from './LinkButton.scss';
import { withToolbarContext } from 'ricos-context';
import LinkModal from '../../../modals/link/LinkComponents/LinkModal';
import { getLangDir, CUSTOM_LINK } from 'wix-rich-content-common';
import { getLinkModalProps } from './utils';
import { withContentQueryContext } from 'ricos-content-query';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

const onDone = (data, toolbarItem, setModalOpen) => {
  if (data.url) {
    toolbarItem.commands?.insertLink(data);
  } else if (data.anchor) {
    toolbarItem.commands?.insertAnchor(data.anchor);
  }
  setModalOpen(false);
};

const onDelete = (toolbarItem, setModalOpen, linkData) => {
  if (linkData.url) {
    toolbarItem.commands?.removeLink();
  } else if (linkData.anchor) {
    toolbarItem.commands?.removeAnchor();
  }
  setModalOpen(false);
};

const LinkButton = ({ toolbarItem, context, contentQueryService, dataHook }) => {
  const {
    isMobile,
    t,
    theme,
    getEditorCommands,
    linkPanelData = {},
    locale,
    experiments,
    portal,
  } = context || {};
  const [isModalOpen, setModalOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  const onClickOutside = e => {
    const modalRef = popperElement;
    if (!modalRef || modalRef.contains(e.target as Node)) {
      return;
    }
    setModalOpen(false);
  };

  const editorCommands = getEditorCommands?.();
  const { onLinkAdd, linkSettings = {}, ...rest } = linkPanelData;
  const { linkData, anchorableBlocks, linkSettingsData } = getLinkModalProps(
    editorCommands,
    linkSettings,
    contentQueryService,
    experiments
  );

  const openCloseModal = () => {
    const isCustomLinkHandling = !!onLinkAdd;
    if (isCustomLinkHandling) {
      const customLinkData = linkData?.customData;
      const callback = data => editorCommands.insertDecoration(CUSTOM_LINK, data);
      onLinkAdd(customLinkData, callback);
    } else {
      setModalOpen(!isModalOpen);
    }
  };

  const Icon = toolbarItem.presentation?.icon;

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
        <div
          className={cx(
            styles.linkModalButtonWrapper,
            isModalOpen || toolbarItem.attributes.active ? styles.active : '',
            { [styles.mobileLinkModalButtonWrapper]: isMobile }
          )}
          ref={setReferenceElement}
        >
          <div
            data-hook={dataHook}
            className={cx(styles.linkModalButton, { [styles.mobileLinkModalButton]: isMobile })}
            role="button"
            onClick={openCloseModal}
            tabIndex={0}
          >
            <Icon />
          </div>
        </div>
      </Tooltip>
      {isModalOpen &&
        ReactDOM.createPortal(
          <div
            dir={getLangDir(locale)}
            ref={setPopperElement}
            style={isMobile ? {} : { ...popperStyles.popper, zIndex: 9 }}
            {...attributes.popper}
          >
            <div data-id="toolbar-modal-button" tabIndex={-1} className={styles.modal}>
              <LinkModal
                isMobile={isMobile}
                t={t}
                theme={theme}
                {...rest}
                {...linkSettingsData}
                {...linkData}
                anchorableBlocksData={anchorableBlocks}
                isActive={!!linkData.url || !!linkData.anchor}
                onDone={({ data }) => onDone(data, toolbarItem, setModalOpen)}
                onCancel={() => setModalOpen(false)}
                onDelete={() => onDelete(toolbarItem, setModalOpen, linkData)}
              />
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withContentQueryContext(withToolbarContext(LinkButton));
