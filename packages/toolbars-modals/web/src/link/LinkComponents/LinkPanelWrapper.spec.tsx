import React from 'react';
import LinkPanelWrapper from './LinkPanelWrapper';
import { render } from '@testing-library/react';

describe('LinkPanelWrapper', () => {
  it('should render LinkWrapper', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let args: any = {};

    const onChangeMock = params => (args = params);
    const fn = jest.fn(onChangeMock);
    const { container } = render(
      <LinkPanelWrapper
        t={key => key}
        anchorTarget={'anchorTarget'}
        relValue={'nofollow ugc'}
        linkValues={{ target: 'target' }}
        onChange={fn}
      />
    );
    const FOLLOW_DATA_HOOK = 'linkPanelRelCheckbox';
    const checkbox: HTMLInputElement | null = container.querySelector(
      `input[data-hook="${FOLLOW_DATA_HOOK}"]`
    );

    expect(checkbox?.checked).toBe(true);

    expect(args.rel).toEqual('nofollow ugc');
  });
});
