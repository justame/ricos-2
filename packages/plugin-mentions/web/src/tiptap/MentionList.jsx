/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import PropTypes from 'prop-types';
import MentionAvatar from './MentionAvatar';
import classNames from 'classnames';
import { RicosContext } from 'ricos-context';
import styles from '../../statics/mention-list.scss';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';

const MentionList = forwardRef((props, ref) => {
  const { languageDir } = useContext(RicosContext) || {};

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = index => {
    const item = props.items[index]?.name;

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  const hasEllipsis = name => {
    const charactersLimit = 23;
    return name.length > charactersLimit;
  };

  return props.items.length ? (
    <div dir={languageDir} className={styles.mention_list}>
      {props.items.map((item, i) => {
        const tooltipContent = hasEllipsis(item.name) ? item.name : null;
        return (
          <Tooltip key={i} content={tooltipContent} place="top">
            <div
              key={i}
              className={classNames(styles.mention_item, {
                [styles.mention_item_selected]: i === selectedIndex,
              })}
              onMouseOver={() => setSelectedIndex(i)}
              onClick={() => selectItem(i)}
            >
              <MentionAvatar src={item?.avatar} alt={item.name} />
              <span>{item.name}</span>
            </div>
          </Tooltip>
        );
      })}
    </div>
  ) : null;
});

MentionList.propTypes = {
  items: PropTypes.array,
  command: PropTypes.func,
};

export default MentionList;
