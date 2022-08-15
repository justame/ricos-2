import type { PluginKey } from 'prosemirror-state';

function pointsAtCell($pos) {
  return $pos.parent.type.spec.tableRole === 'row' && $pos.nodeAfter;
}

export class ResizeState {
  activeHandle: number;

  dragging?: { startY: number; startX: number } | false;

  key: PluginKey;

  constructor(activeHandle, dragging, pluginKey) {
    this.activeHandle = activeHandle;
    this.dragging = dragging;
    this.key = pluginKey;
  }

  apply(tr) {
    const action = tr.getMeta(this.key);
    if (action && action.setHandle) {
      return new ResizeState(action.setHandle, null, this.key);
    }
    if (action && action.setDragging) {
      return new ResizeState(this.activeHandle, action.setDragging, this.key);
    }
    if (this.activeHandle > -1 && tr.docChanged) {
      let handle = tr.mapping.map(this.activeHandle, -1);
      if (!pointsAtCell(tr.doc.resolve(handle))) handle = null;
      return new ResizeState(handle, this.dragging, this.key);
    }
    if (action && 'setDragging' in action && action.setDragging === null) {
      return new ResizeState(this.activeHandle, action.setDragging, this.key);
    }
    return this;
  }
}
