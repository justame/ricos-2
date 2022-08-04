/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import styles from '../../statics/styles/tabs.scss';

interface TabsHeaderProps {
  label: any;
  value: string;
  focusIndex: number;
  focused?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onKeyDown?: (e) => void;
}

const TabsHeader: React.FC<TabsHeaderProps> = ({
  label,
  value,
  isSelected,
  onClick,
  focused,
  onKeyDown,
  focusIndex,
}) => {
  const [tabIndex, setTabIndex] = useState(isSelected ? 0 : focusIndex);
  const headerRef = useRef<HTMLButtonElement>(null);
  const onBlur = () => (isSelected ? setTabIndex(0) : setTabIndex(-1));

  useEffect(() => {
    if (focused) {
      headerRef?.current?.focus();
    } else {
      !isSelected && setTabIndex(-1);
    }
  }, [focusIndex, isSelected]);

  return (
    <button
      id={`${value}_header`}
      role="tab"
      tabIndex={tabIndex}
      name={`tabs`}
      key={value}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      ref={headerRef}
      className={classNames(styles.tabs_headers_option, {
        [styles.tabs_headers_option_selected]: isSelected,
      })}
      data-hook={`${value}_Tab`}
      aria-controls={`${value}_panel`}
      aria-label={label}
      aria-selected={isSelected}
      onClick={onClick}
    >
      <span className={styles.tabs_headers_option_label}>{label}</span>
    </button>
  );
};

export default TabsHeader;
