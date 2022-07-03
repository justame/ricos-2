import React, { useContext } from 'react';
import { Section, Page } from '../Components/StoryParts';
import { ModalProvider, ModalContext } from 'ricos-modals';
import { Button } from 'wix-style-react';
import styles from './modals.scss';

const DrawerWrapper = () => (
  <ModalProvider>
    <Drawer />
  </ModalProvider>
);

const Drawer = () => {
  const modalService = useContext(ModalContext) || {};

  const openDrawer = placement => {
    modalService.openModal({
      Component: () => <div className={styles.modalComp}>My drawer modal</div>,
      id: 'drawerStory',
      layout: 'drawer',
      positioning: { placement },
    });
  };
  return (
    <ModalProvider>
      <Page title="Drawer">
        <Section>
          <div>Click the buttons below to open drawer in different placements</div>
          <div className={styles.multipleButtons}>
            <Button onClick={() => openDrawer('left')}>Left</Button>
            <Button onClick={() => openDrawer('right')}>Right</Button>
            <Button onClick={() => openDrawer('top')}>Top</Button>
            <Button onClick={() => openDrawer('bottom')}>Bottom</Button>
          </div>
        </Section>
      </Page>
    </ModalProvider>
  );
};

export { DrawerWrapper as Drawer };
