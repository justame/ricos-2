import React, { Suspense, lazy } from 'react';

const LinkModalController = lazy(() =>
  import('wix-rich-content-toolbars-modals').then(({ LinkModalController }) => ({
    default: LinkModalController,
  }))
);

const LinkPanelComponent = props => {
  return (
    <Suspense fallback={<div style={{ width: 542, height: 415 }}>loading</div>}>
      <LinkModalController {...props} />
    </Suspense>
  );
};

export default LinkPanelComponent;
