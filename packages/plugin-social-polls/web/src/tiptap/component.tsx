import React, { useContext } from 'react';
import { PollEditor } from '../components';
import { POLL_TYPE } from '../types';
import type { PluginProps } from 'ricos-types';
import { convertBlockDataToRicos } from 'ricos-content/libs/convertBlockDataToRicos';
import { RicosContext } from 'ricos-context';

export const Poll: React.FC<PluginProps> = ({
  settings,
  componentData,
  node,
  updateAttributes,
  selected,
}) => {
  const { theme, t, isMobile, experiments } = useContext(RicosContext);
  const block = { getKey: () => node.attrs.id };
  const helpers = { handleFileUpload: settings.handleFileUpload };
  //mocks
  const store = {
    update: (type, data) => updateAttributes(convertBlockDataToRicos(POLL_TYPE, data)),
    set: (type, data, id) => updateAttributes(convertBlockDataToRicos(POLL_TYPE, data)),
    get: type => componentData,
  };
  const setInPluginEditingMode = () => {};

  return (
    <div>
      <PollEditor
        componentData={componentData}
        settings={settings}
        theme={theme}
        t={t}
        isMobile={isMobile}
        block={block}
        selected={selected}
        helpers={helpers}
        store={store}
        setInPluginEditingMode={setInPluginEditingMode}
        experiments={experiments}
      />
    </div>
  );
};
