import { TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE, TIPTAP_COLLAPSIBLE_ITEM_TYPE } from 'ricos-content';
import { collapsibleItemDropHandlerPlugin } from '../consts';

export const dropHandlerPlugin = (editor, Plugin) => {
  return new Plugin({
    key: collapsibleItemDropHandlerPlugin,
    props: {
      handleDrop(view, event, slice, moved) {
        const collapsibleItemFound = slice?.content?.content.find(
          node => node.type.name === TIPTAP_COLLAPSIBLE_ITEM_TYPE
        );
        if (moved && collapsibleItemFound) {
          const coords = { left: event.clientX, top: event.clientY };
          const pos = view.posAtCoords(coords);
          const path = editor.state.doc.resolve(pos.pos);
          const parent = path.parent;

          if (
            parent.type.name === TIPTAP_COLLAPSIBLE_ITEM_BODY_TYPE ||
            parent.type.name === TIPTAP_COLLAPSIBLE_ITEM_TYPE
          ) {
            return false;
          }

          return true;
        }
        return false;
      },
    },
  });
};
