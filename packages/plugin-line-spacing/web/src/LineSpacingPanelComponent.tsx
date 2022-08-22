import React, { Suspense, lazy } from 'react';

const LineSpacingPanelController = lazy(() =>
  import('wix-rich-content-toolbars-modals').then(({ LineSpacingPanelController }) => ({
    default: LineSpacingPanelController,
  }))
);

const LineSpacingPanelComponent = props => (
  <Suspense fallback={<div style={{ width: 143 }}>loading</div>}>
    <LineSpacingPanelController {...props} />
  </Suspense>
);

export default LineSpacingPanelComponent;
