import React, { useState, useContext } from 'react';
import { Section, Page } from '../Components/StoryParts';
import { ModalProvider, ModalContext } from 'ricos-modals';
import type { Placement } from 'ricos-types';
import { Dropdown, Button } from 'wix-style-react';
import styles from './modals.scss';

const PopoverWrapper = () => (
  <ModalProvider>
    <Popover />
  </ModalProvider>
);

const Popover = () => {
  const [placement, setPlacement] = useState<Placement>('top-start');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [referenceElement, setReferenceElement] = useState<any>();

  const modalService = useContext(ModalContext) || {};

  const openPopover = () => {
    modalService.openModal({
      Component: () => <div className={styles.modalComp}>My popover modal</div>,
      id: 'popoverStory',
      layout: 'popover',
      positioning: { referenceElement, placement },
    });
  };
  return (
    <ModalProvider>
      <Page title="Popover">
        <Section>
          <div>
            Given an element, such as a button, and a modal element, Popover will automatically put
            the modal in the right place near the button
          </div>
          <div className={styles.placement}>
            Placement:
            <Dropdown
              size="small"
              options={[
                { value: 'top-start', id: 'top-start' },
                { value: 'top', id: 'top' },
                { value: 'top-end', id: 'top-end' },
                { value: 'right-start', id: 'right-start' },
                { value: 'right', id: 'right' },
                { value: 'right-end', id: 'right-end' },
                { value: 'bottom-start', id: 'bottom-start' },
                { value: 'bottom', id: 'bottom' },
                { value: 'bottom-end', id: 'bottom-end' },
                { value: 'left-start', id: 'left-start' },
                { value: 'left', id: 'left' },
                { value: 'left-end', id: 'left-end' },
              ]}
              selectedId={placement}
              onSelect={option => setPlacement(option.id as Placement)}
            />
          </div>
          <div className={styles.singleButton}>
            <div ref={setReferenceElement}>
              <Button onClick={openPopover}>Open Popover</Button>
            </div>
          </div>
        </Section>
      </Page>
    </ModalProvider>
  );
};

export { PopoverWrapper as Popover };
