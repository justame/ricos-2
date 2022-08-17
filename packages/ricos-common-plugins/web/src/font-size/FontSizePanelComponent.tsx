import React, { Suspense, lazy } from 'react';

const FontSizePanelController = lazy(() =>
  import('wix-rich-content-toolbars-modals').then(({ FontSizePanelController }) => ({
    default: FontSizePanelController,
  }))
);

const FontSizePanelComponent = props => (
  <Suspense fallback={<div style={{ width: 38 }}>loading</div>}>
    <FontSizePanelController {...props} />
  </Suspense>
);

export default FontSizePanelComponent;
