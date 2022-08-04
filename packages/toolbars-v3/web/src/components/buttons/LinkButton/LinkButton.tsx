/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from 'wix-rich-content-editor-common';
import styles from './LinkButton.scss';
import { withToolbarContext } from 'ricos-context';
import { LinkModal, getLinkModalProps } from 'wix-rich-content-toolbars-modals';
import { getLangDir, CUSTOM_LINK } from 'wix-rich-content-common';
import { withContentQueryContext } from 'ricos-content-query';
import { ToolbarButton } from '../ToolbarButton';
import { onModalKeyDown } from '../modal-buttons-utils';
import { FocusManager } from 'wix-rich-content-ui-components';

const onDone = (data, toolbarItem, setModalOpen) => {
  if (data.url) {
    toolbarItem.commands?.insertLink(data);
  } else if (data.anchor) {
    toolbarItem.commands?.insertAnchor(data);
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

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <div ref={setReferenceElement}>
        <ToolbarButton
          isMobile={isMobile}
          active={isModalOpen || toolbarItem.attributes.active}
          tooltip={tooltip}
          onClick={openCloseModal}
          icon={toolbarItem.presentation?.icon}
          dataHook={dataHook}
        />
      </div>
      {isModalOpen &&
        ReactDOM.createPortal(
          <div
            dir={getLangDir(locale)}
            ref={!isMobile ? setPopperElement : () => null}
            style={isMobile ? {} : { ...popperStyles.popper }}
            {...attributes.popper}
            className={isMobile ? '' : styles.popperContainer}
          >
            <FocusManager>
              <div
                data-id="toolbar-modal-button"
                tabIndex={-1}
                className={styles.modal}
                onKeyDown={e => onModalKeyDown(e, () => setModalOpen(false))}
              >
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
            </FocusManager>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withContentQueryContext(withToolbarContext(LinkButton));
