import React, { useContext } from 'react';
import { Section, Page } from '../Components/StoryParts';
import { ModalProvider, ModalContext } from 'ricos-modals';
import { Button } from 'wix-style-react';
import styles from './modals.scss';

const DialogWrapper = () => (
  <ModalProvider>
    <Dialog />
  </ModalProvider>
);

const Dialog = () => {
  const modalService = useContext(ModalContext) || {};

  const openModal = () => {
    modalService.openModal({
      Component: () => <div className={styles.modalComp}>My dialog modal</div>,
      id: 'dialogStory',
      layout: 'dialog',
    });
  };
  return (
    <ModalProvider>
      <Page title="Dialog">
        <Section>
          <div>Click the button below to open dialog modal</div>
          <div className={styles.singleButton}>
            <Button onClick={openModal}>Open dialog</Button>
          </div>
        </Section>
      </Page>
    </ModalProvider>
  );
};

export { DialogWrapper as Dialog };
