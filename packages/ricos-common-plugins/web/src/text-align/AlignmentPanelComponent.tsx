import React, { Suspense, lazy } from 'react';

const AlignmentPanelController = lazy(() =>
  import('wix-rich-content-toolbars-modals').then(({ AlignmentPanelController }) => ({
    default: AlignmentPanelController,
  }))
);

const AlignmentPanelComponent = props => (
  <Suspense fallback={<div style={{ width: 38 }}>loading</div>}>
    <AlignmentPanelController {...props} />
  </Suspense>
);

export default AlignmentPanelComponent;
