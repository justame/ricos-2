import type { ReactNode } from 'react';
import { isEqual } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { ModalContext } from 'ricos-context';
import type { Modal } from 'ricos-types';
import { ClickOutside } from 'wix-rich-content-editor-common';

interface Props {
  children: ReactNode;
  modalConfig: Modal;
  closeModal: () => void;
  className: string;
}

export const Popper = ({ children, modalConfig, closeModal, className }: Props) => {
  const [modalElement, setModalElement] = useState<HTMLDivElement | null>(null);
  const modalService = useContext(ModalContext) || {};

  const { referenceElement, placement } = modalConfig.positioning || {};
  const popper = usePopper(referenceElement, modalElement, {
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
  const { styles: popperStyles, attributes, update } = popper || {};

  useEffect(() => {
    let frameId;
    const prevRefRect = referenceElement?.getBoundingClientRect().toJSON();

    function frameLoop() {
      const refBoundClientRect = referenceElement?.getBoundingClientRect().toJSON();

      if (!isEqual(refBoundClientRect, prevRefRect)) {
        update?.();
      }

      frameId = requestAnimationFrame(frameLoop);
    }

    frameLoop();

    return () => {
      return cancelAnimationFrame(frameId);
    };
  }, [referenceElement, popper]);

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
