import Suggestion from '@tiptap/suggestion';
import type { Editor } from '@tiptap/react';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import MentionList from './MentionList.jsx';

export default (
  editor,
  {
    mentionTrigger,
    getMentions,
    visibleItemsBeforeOverflow,
    popoverComponent,
    handleDropdownOpen,
    handleDropdownClose,
    supportWhitespace = true,
  },
  PluginKey
) => {
  const shouldEndMentioningProcess = (query, items) => {
    //There is no way to programmatically end mentioning process
    //https://github.com/ueberdosis/tiptap/issues/823
    const names = items.map(item => item.name.toLowerCase());
    return !names.some(name => name.includes(query.toLowerCase()));
  };

  return Suggestion({
    editor,
    char: mentionTrigger,
    allowSpaces: supportWhitespace,
    pluginKey: new PluginKey('mention'),
    command: ({ editor, range, props }) => {
      editor.chain().focus().insertMention({ name: props.id }, range).run;
    },
    items: async ({ query }) => {
      const mentions = await getMentions(query);
      return mentions
        .map(mention => ({
          name: mention.name,
          avatar: mention.avatar,
        }))
        .slice(0, visibleItemsBeforeOverflow);
    },
    render: () => {
      let component;
      let popup;

      return {
        onStart: props => {
          handleDropdownOpen?.();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component = new ReactRenderer(MentionList as any, {
            editor: editor as Editor,
            props: { ...props, container: popoverComponent },
          });

          component.element.setAttribute('dir', '');

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props) {
          component.updateProps(props);

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            handleDropdownClose?.();

            return true;
          }

          const { items, query } = component.props;
          if (props.event.key === 'Enter' && shouldEndMentioningProcess(query, items)) {
            this.onExit();
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
          handleDropdownClose?.();
        },
      };
    },
  });
};
