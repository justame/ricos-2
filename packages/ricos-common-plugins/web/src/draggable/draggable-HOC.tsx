import React from 'react';

const DraggableHOC = Component => {
  const Draggable = props => (
    <div data-drag-handle>
      <Component {...props} />
    </div>
  );
  Draggable.displayName = 'Draggable';

  return Draggable;
};

export default DraggableHOC;
