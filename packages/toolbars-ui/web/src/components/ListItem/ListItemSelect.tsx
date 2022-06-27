import React from 'react';
import type { FC } from 'react';
import styles from './list-item-select.scss';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import classNames from 'classnames';

type Props = {
  dataHook?: string;
  prefix?;
  title?: string;
  subtitle?: string;
  suffix?;
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ellipsis?: boolean;
  tooltip?: string;
  onKeyDown?: () => void;
};

const ListItemSelect: FC<Props> = ({
  title,
  subtitle,
  prefix,
  suffix,
  dataHook,
  selected,
  disabled,
  onClick,
  tooltip,
  onKeyDown,
}) => {
  return (
    <Tooltip content={tooltip}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={classNames(styles.container, {
          [styles.selected]: selected,
        })}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onKeyDown={onKeyDown}
        data-hook={dataHook}
        data-selected={selected}
        onClick={disabled ? undefined : onClick}
      >
        <div className={styles.content}>
          {prefix && <div className={styles.prefix}>{prefix}</div>}
          <div className={styles.titleWrapper}>
            {title && <div className={styles.title}>{title}</div>}
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
          {suffix && <div className={styles.suffix}>{suffix}</div>}
        </div>
      </div>
    </Tooltip>
  );
};

export default ListItemSelect;
