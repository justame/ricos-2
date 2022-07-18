import React, { useContext } from 'react';
import VerticalEmbedComponent from '../vertical-embed-component';
import type { PluginProps } from 'ricos-types';
import { RicosContext } from 'ricos-context';

export const AppEmbed: React.FC<PluginProps> = ({ settings, componentData }) => {
  const { t } = useContext(RicosContext);
  const helpers = {};
  const locale = 'en';
  const className = '';

  return (
    <div>
      <VerticalEmbedComponent
        componentData={componentData}
        settings={settings}
        t={t}
        helpers={helpers}
        locale={locale}
        className={className}
      />
    </div>
  );
};
