/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';
import type { Helpers, RichContentTheme, AnchorTarget } from 'wix-rich-content-common';
import { mergeStyles, getRelValue } from 'wix-rich-content-common';
import Styles from '../../statics/styles/default-styles.scss';
import { ACTION_BUTTON_TYPE, LINK_BUTTON_TYPE } from '../types';

interface Props {
  style: Record<string, unknown>;
  anchorTarget: AnchorTarget;
  onClick?: React.DOMAttributes<HTMLAnchorElement>['onClick'] &
    React.DOMAttributes<HTMLDivElement>['onClick'];
  helpers: Helpers;
  theme: RichContentTheme;
  url: string;
  target: HTMLAnchorElement['target'];
  rel: HTMLAnchorElement['rel'];
  buttonText: string;
}

const ButtonViewer: FC<Props> = ({
  style,
  anchorTarget,
  onClick,
  theme,
  helpers,
  url,
  target = anchorTarget,
  rel,
  buttonText,
}) => {
  const styles = mergeStyles({ styles: Styles, theme });
  const isActionButton = useMemo(() => Boolean(onClick), [onClick]);
  const onClickHandler: Props['onClick'] = useCallback(
    args => {
      helpers.onViewerAction?.(isActionButton ? ACTION_BUTTON_TYPE : LINK_BUTTON_TYPE, 'Click', '');
      if (isActionButton) {
        onClick?.(args);
      }
    },
    [helpers.onViewerAction]
  );
  const Component = isActionButton ? 'div' : 'a';

  return (
    <Component
      className={styles.button_container}
      style={style}
      data-hook="buttonViewer"
      onClick={onClickHandler}
      tabIndex={0}
      role="button"
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onClickHandler(e);
        }
      }}
      {...(!isActionButton && { href: url, target, rel: getRelValue(rel) })}
    >
      <div className={styles.button_text}>{buttonText}</div>
    </Component>
  );
};

export default ButtonViewer;
