import React from 'react';
import type { FC } from 'react';
import type { Pubsub } from 'ricos-types';
import HtmlEditPanel from './HtmlEditPanel';

type Props = {
  store: Pubsub;
};

export const HtmlEditPanelDraft: FC<Props> = props => {
  const updateData = data => props.store.update('componentData', data);

  return <HtmlEditPanel {...props} updateData={updateData} />;
};

export default HtmlEditPanelDraft;
