import React, { useContext } from 'react';
import type { FC } from 'react';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
import { ModalContext, RicosContext, EditorContext, PluginsEventsContext } from 'ricos-context';
import GiphyApiInputModal from '../toolbar/giphyApiInputModal';
import { GIPHY_TYPE } from '../types';
import styles from '../../statics/styles/giphy-api-input-modal.scss';

interface Props {
  giphySdkApiKey: string;
  modalId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentData: Record<string, any>;
  nodeId?: string;
}

const GiphyInsertModal: FC<Props> = ({ componentData, giphySdkApiKey, nodeId, modalId }) => {
  const { theme, t, isMobile, languageDir } = useContext(RicosContext);
  const { getEditorCommands } = useContext(EditorContext);
  const modalService = useContext(ModalContext) || {};
  const pluginsEvents = useContext(PluginsEventsContext);
  const closeModal = () => {
    modalService.closeModal(modalId);
  };
  const addBlockWithFocus = insertBlock => setTimeout(() => insertBlock(), 50);

  const onGifAdd = gif => {
    const editorCommands = getEditorCommands();
    const data = convertBlockDataToRicos(GIPHY_TYPE, { ...componentData, gif });
    let insertGif = () => {
      editorCommands?.insertBlockWithBlankLines(GIPHY_TYPE, data);
    };
    if (nodeId) {
      insertGif = () => {
        editorCommands?.setBlock(nodeId, GIPHY_TYPE, data);
      };
    }
    addBlockWithFocus(insertGif);
  };

  const pluginEvents = {
    onPluginAction: (_, { searchTerm }) =>
      pluginsEvents.publishPluginPopoverSearch({ pluginId: GIPHY_TYPE, searchTerm }),
  };

  return (
    <div className={styles.modalWrapper}>
      <GiphyApiInputModal
        giphySdkApiKey={giphySdkApiKey}
        componentData={componentData}
        theme={theme}
        t={t}
        isMobile={isMobile}
        languageDir={languageDir}
        onGifAdd={onGifAdd}
        onCloseRequested={closeModal}
        helpers={pluginEvents}
      />
    </div>
  );
};

export default GiphyInsertModal;
