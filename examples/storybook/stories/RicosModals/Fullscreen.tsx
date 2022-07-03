import React, { useContext } from 'react';
import { Section, Page } from '../Components/StoryParts';
import { ModalProvider, ModalContext } from 'ricos-modals';
import { Button } from 'wix-style-react';
import styles from './modals.scss';

const FullscreenWrapper = () => (
  <ModalProvider>
    <Fullscreen />
  </ModalProvider>
);

const Fullscreen = () => {
  const modalService = useContext(ModalContext) || {};

  const openModal = () => {
    modalService.openModal({
      Component: () => (
        <div className={styles.modalComp}>
          My fullscreen modal
          <button onClick={() => modalService.closeModal('fullscreenStory')}>close modal</button>
        </div>
      ),
      id: 'fullscreenStory',
      layout: 'fullscreen',
    });
  };
  return (
    <ModalProvider>
      <Page title="Fullscreen">
        <Section>
          <div>Click the button below to open fullscreen modal</div>
          <div className={styles.singleButton}>
            <Button onClick={openModal}>Open fullscreen</Button>
          </div>
        </Section>
      </Page>
    </ModalProvider>
  );
};

export { FullscreenWrapper as Fullscreen };
