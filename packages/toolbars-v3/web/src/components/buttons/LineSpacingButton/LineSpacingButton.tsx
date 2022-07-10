/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { ClickOutside } from 'wix-rich-content-editor-common';
import cx from 'classnames';
import styles from './LineSpacingButton.scss';
import { DropdownArrowIcon } from '../../../icons';
import { withToolbarContext } from 'ricos-context';
import LineSpacingPanel from '../../../modals/line-spacing/LineSpacingPanel';
import { getLangDir } from 'wix-rich-content-common';
import { getCurrentSelection } from './utils';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

const onSave = (data, toolbarItem, setModalOpen) => {
  toolbarItem.commands?.setLineSpacing(data);
  setModalOpen(false);
};

const onCancel = (toolbarItem, original, setModalOpen) => {
  toolbarItem.commands?.setLineSpacing(original);
  setModalOpen(false);
};

const LineSpacingButton = ({ toolbarItem, context, dataHook }) => {
  const {
    isMobile,
    t,
    theme,
    defaultLineSpacing: defaultLineSpacingFromApi,
    locale,
    portal,
  } = context || {};
  const [isModalOpen, setModalOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [original, setOriginal] = useState<Record<string, string>>({});

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

  const openCloseModal = () => {
    if (isModalOpen) {
      setModalOpen(false);
    } else {
      setModalOpen(true);
      setOriginal(spacing);
    }
  };

  const spacing = getCurrentSelection(toolbarItem, defaultLineSpacingFromApi);

  const Icon = toolbarItem.presentation?.icon;

  const tooltip = t(toolbarItem.presentation?.tooltip);
  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <Tooltip key={tooltip} content={tooltip} tooltipOffset={{ x: 0, y: -8 }}>
        <div
          className={cx(styles.lineSpacingModalButtonWrapper, isModalOpen ? styles.active : '', {
            [styles.mobileLineSpacingModalButtonWrapper]: isMobile,
          })}
          ref={setReferenceElement}
        >
          <div
            data-hook={dataHook}
            className={cx(styles.lineSpacingModalButton, {
              [styles.mobileLineSpacingModalButton]: isMobile,
            })}
            role="button"
            onClick={openCloseModal}
            tabIndex={0}
          >
            <Icon />
            <DropdownArrowIcon />
          </div>
        </div>
      </Tooltip>
      {isModalOpen &&
        ReactDOM.createPortal(
          <div
            dir={getLangDir(locale)}
            ref={!isMobile ? setPopperElement : () => null}
            style={isMobile ? {} : { ...popperStyles.popper }}
            {...attributes.popper}
            className={isMobile ? '' : styles.popperContainer}
          >
            <div data-id="toolbar-modal-button" tabIndex={-1} className={styles.modal}>
              <LineSpacingPanel
                isMobile={isMobile}
                t={t}
                theme={theme}
                currentSelect={spacing}
                onSave={({ data }) => onSave(data, toolbarItem, setModalOpen)}
                onChange={data => toolbarItem.commands?.setLineSpacingWithoutFocus(data)}
                onCancel={() => onCancel(toolbarItem, original, setModalOpen)}
                closeModal={() => setModalOpen(false)}
              />
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};

export default withToolbarContext(LineSpacingButton);
