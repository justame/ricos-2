import type { ReactNode } from 'react';
import React, { useContext, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { ModalContext } from 'ricos-context';
import type { ModalConfig } from 'ricos-types';
import { ClickOutside } from 'wix-rich-content-editor-common';

interface Props {
  children: ReactNode;
  modalConfig: ModalConfig;
  closeModal: () => void;
  className: string;
}

export const Popper = ({ children, modalConfig, closeModal, className }: Props) => {
  const [modalElement, setModalElement] = useState<HTMLDivElement | null>(null);
  const modalService = useContext(ModalContext) || {};

  const { referenceElement, placement } = modalConfig.positioning || {};
  const { styles: popperStyles, attributes } = usePopper(referenceElement, modalElement, {
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  const closeOpenModalsWithSameRef = () => {
    //Closes all open modals with the same reference element
    const currentId = modalConfig.id;
    modalService?.getOpenModals().find(({ id, positioning }) => {
      const isSameRef = positioning?.referenceElement === referenceElement;
      const shouldCloseModal = isSameRef && id !== currentId;
      return shouldCloseModal && modalService?.closeModal(id);
    });
  };

  useEffect(() => {
    closeOpenModalsWithSameRef();
  }, []);

  const onClickOutside = e => {
    !referenceElement.contains(e.target) && closeModal();
  };

  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <div
        ref={setModalElement}
        style={popperStyles.popper}
        className={className}
        {...attributes.popper}
      >
        {children}
      </div>
    </ClickOutside>
  );
};
