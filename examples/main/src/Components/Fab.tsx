import type { ReactElement } from 'react';
import React from 'react';
import { Fab as FabButton, Action } from 'react-tiny-fab';
import { MdAdd, MdEdit, MdRemoveRedEye, MdCode, MdSettings } from 'react-icons/md';
import 'react-tiny-fab/dist/styles.min.css';
import type { OnVisibilityChanged } from '../types';

const Fab = React.memo<{
  isMobile: boolean;
  isEditorShown: boolean;
  isViewerShown: boolean;
  isContentStateShown: boolean;
  isEditorSettingsShown: boolean;
  toggleSectionVisibility: OnVisibilityChanged;
}>(
  ({
    isMobile,
    isEditorShown,
    isViewerShown,
    isContentStateShown,
    isEditorSettingsShown,
    toggleSectionVisibility,
  }) => {
    let hideFab = true;
    if (!isMobile) {
      hideFab = isEditorShown && isViewerShown && isContentStateShown && isEditorSettingsShown;
    } else {
      hideFab = isEditorShown || isViewerShown || isContentStateShown || isEditorSettingsShown;
    }
    if (hideFab) {
      return null;
    }

    const FabActions: ReactElement[] = [];
    if (!isEditorShown) {
      FabActions.push(
        <Action
          text="Editor"
          key="editor-action"
          onClick={() => toggleSectionVisibility('Editor', true)}
        >
          <MdEdit />
        </Action>
      );
    }
    if (!isViewerShown) {
      FabActions.push(
        <Action
          text="Viewer"
          key="viewer-action"
          onClick={() => toggleSectionVisibility('Viewer', true)}
        >
          <MdRemoveRedEye />
        </Action>
      );
    }
    if (!isContentStateShown) {
      FabActions.push(
        <Action
          text="Content State"
          key="content-state-action"
          onClick={() => toggleSectionVisibility('ContentState', true)}
        >
          <MdCode />
        </Action>
      );
    }

    if (!isEditorSettingsShown) {
      FabActions.push(
        <Action
          text="Editor Settings"
          key="editor-settings"
          onClick={() => toggleSectionVisibility('EditorSettings', true)}
        >
          <MdSettings />
        </Action>
      );
    }

    return (
      <FabButton icon={<MdAdd />} event={!isMobile ? 'hover' : 'click'}>
        {FabActions}
      </FabButton>
    );
  }
);

export default Fab;
