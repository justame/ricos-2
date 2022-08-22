import React, { useContext, useEffect, useState } from 'react';
import type { ToolbarContextType } from 'ricos-context';
import { ToolbarContext, RicosContext } from 'ricos-context';
import LineSpacingPanel from './LineSpacingPanel';
import { omitBy, isNil } from 'lodash';
import type { EditorCommands } from 'ricos-types';

const getCurrentSelection = (
  editorCommands: EditorCommands,
  defaultLineSpacingFromApi: ToolbarContextType['defaultLineSpacing']
) => {
  const currentSpacing = editorCommands.getBlockSpacing();

  const defaultLineSpacing = {
    'line-height': '1.5',
    'padding-top': '2px',
    'padding-bottom': '3px',
  };

  return {
    ...defaultLineSpacing,
    ...omitBy(defaultLineSpacingFromApi, isNil),
    ...omitBy(currentSpacing, isNil),
  };
};

const LineSpacingPanelController = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useContext(RicosContext);
  const {
    isMobile,
    theme,
    getEditorCommands,
    defaultLineSpacing: defaultLineSpacingFromApi,
  } = useContext(ToolbarContext);

  const editorCommands = getEditorCommands();
  const spacing = getCurrentSelection(editorCommands, defaultLineSpacingFromApi);
  const [original, setOriginal] = useState<Record<string, string>>({});

  useEffect(() => {
    setOriginal(spacing);
  }, []);

  return (
    <LineSpacingPanel
      isMobile={isMobile}
      t={t}
      theme={theme}
      currentSelect={spacing}
      onSave={data => {
        editorCommands.insertDecoration('ricos-line-spacing', data);
        closeModal();
      }}
      onChange={data => {
        editorCommands.insertDecoration('ricos-line-spacing', data);
      }}
      onCancel={() => {
        editorCommands.insertDecoration(
          'ricos-line-spacing',
          { data: original },
          { shouldFocus: true }
        );
        closeModal();
      }}
      closeModal={closeModal}
    />
  );
};

export default LineSpacingPanelController;
