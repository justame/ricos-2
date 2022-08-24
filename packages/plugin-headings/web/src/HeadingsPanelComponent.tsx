import React, { Suspense, lazy } from 'react';

const HeadingsPanelController = lazy(() =>
  import('wix-rich-content-toolbars-modals').then(({ HeadingsPanelController }) => ({
    default: HeadingsPanelController,
  }))
);

const HeadingPanelComponent = (suspenseWidth: number) => props =>
  (
    <Suspense fallback={<div style={{ width: suspenseWidth }}>loading</div>}>
      <HeadingsPanelController {...props} />
    </Suspense>
  );

export default HeadingPanelComponent;
