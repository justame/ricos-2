import { TIPTAP_COLLAPSIBLE_LIST_TYPE } from 'ricos-content';
import { collapsibleItemDropHandlerPlugin } from '../consts';

export const dropHandlerPlugin = (editor, Plugin) => {
  return new Plugin({
    key: collapsibleItemDropHandlerPlugin,
    props: {
      handleDrop(view, event) {
        const coords = { left: event.clientX, top: event.clientY };
        const pos = view.posAtCoords(coords);
        const path = editor.state.doc.resolve(pos.pos).path;
        return !path.some(node => node?.type?.name === TIPTAP_COLLAPSIBLE_LIST_TYPE);
      },
    },
  });
};
