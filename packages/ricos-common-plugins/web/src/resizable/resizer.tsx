import React from 'react';
import { Resizable } from 're-resizable';
import { throttle } from 'lodash';
import styles from '../statics/styles.scss';

const Handler = () => {
  return <span className={styles.handlerRight} />;
};
const Resizer = ({
  children,
  componentData,
  onResize,
  maxWidth,
  minWidth,
  onResizeStop,
  disabled,
}) => {
  const enable = {
    left: true,
    right: true,
  };

  switch (componentData.containerData.alignment) {
    case 'LEFT':
      enable.left = false;
      break;
    case 'RIGHT':
      enable.right = false;
      break;
    default:
      break;
  }
  if (disabled) {
    enable.left = false;
    enable.right = false;
  }
  return (
    <Resizable
      minWidth={minWidth}
      maxWidth={maxWidth}
      size={{ width: 'auto', height: 'auto' }}
      enable={enable}
      className={styles.resizer}
      onResize={onResize}
      onResizeStop={onResizeStop}
      handleClasses={{
        right: styles.handlerRight,
        left: styles.handlerRight,
      }}
      handleStyles={{
        right: {
          borderRadius: '50%',
          width: 14,
          height: 14,
          zIndex: 1,
          background: `#fff`,
          border: 'solid 2px blue',
          position: 'absolute',
          top: `calc(50% - 7px)`,
          right: -8,
        },
        left: {
          borderRadius: '50%',
          width: 14,
          height: 14,
          zIndex: 1,
          background: `#fff`,
          border: 'solid 2px blue',
          position: 'absolute',
          top: `calc(50% - 7px)`,
          left: -8,
        },
      }}
      handleComponent={{
        right: <Handler />,
        left: <Handler />,
      }}
    >
      {children}
    </Resizable>
  );
};

const ResizerHOC = Component => {
  return props => {
    const { editor, updateAttributes, componentData, selected } = props;
    const onResizeThrottle = throttle((event, direction, elementRef) => {
      if (Number.isInteger(parseInt(elementRef.style.width))) {
        updateAttributes({
          containerData: {
            ...props.componentData.containerData,
            width: {
              custom: parseInt(elementRef.style.width),
            },
          },
        });
      }
    }, 30);

    const onResizeStop = (_event, _direction, elementRef) => {
      updateAttributes({
        containerData: {
          ...props.componentData.containerData,
          width: {
            custom: parseInt(elementRef.style.width),
          },
        },
      });
    };

    const onResize = onResizeThrottle;
    const minWidth = 15;
    const maxWidth = Math.max(minWidth, editor.view.dom.clientWidth);
    return (
      <Resizer
        disabled={!selected}
        componentData={componentData}
        onResize={onResize}
        maxWidth={maxWidth}
        minWidth={minWidth}
        onResizeStop={onResizeStop}
      >
        <Component {...props} />
      </Resizer>
    );
  };
};

export default ResizerHOC;
