/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useFloating, shift, offset, autoUpdate, flip } from '@floating-ui/react-dom';
import { ClickOutside } from '../Clickoutside/ClickOutside';
import type { RicosPortal } from 'ricos-types';

//TODO: remove this import and find solution
import { posToDOMRect } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import type { Selection } from 'prosemirror-state';
import { debounce } from 'lodash';

export const FloatingToolbar = ({
  editor,
  portal,
  isVisible,
  children,
}: {
  editor: Editor;
  portal: RicosPortal;
  isVisible: (selection: Selection) => boolean;
  children: any;
}) => {
  const { state, view } = editor;
  const { from, to } = state.selection;

  const [dummyUpdate, setForceUpdate] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'top',
    middleware: [
      flip({
        boundary: editor.view.dom || undefined,
      }),
      shift({
        padding: 10,
        boundary: editor.view.dom || undefined,
      }),
      offset(8),
    ],

    whileElementsMounted: (referenceEl, floatingEl, update) =>
      autoUpdate(referenceEl, floatingEl, update, {
        animationFrame: true, // this fix issue of reposition when scrolling
      }),
  });

  const forceUpdate = useCallback(() => {
    setForceUpdate(dummyUpdate + Math.random());
  }, []);
  const debounceRender = useCallback(
    debounce(() => {
      forceUpdate();
    }, 300),
    []
  );

  useEffect(() => {
    editor.on('selectionUpdate', () => {
      setModalOpen(true);
    });
    editor.on('selectionUpdate', debounceRender);
    editor.on('blur', forceUpdate);
    window.addEventListener('resize', debounceRender);

    return () => {
      editor.off('selectionUpdate', debounceRender);
      editor.off('blur', forceUpdate);
      editor.off('focus', forceUpdate);
      window.removeEventListener('resize', debounceRender);
    };
  }, []);

  useLayoutEffect(() => {
    // Call reference with the virtual element inside an effect
    reference({
      getBoundingClientRect() {
        return posToDOMRect(view, from, to);
      },
    });
  }, [reference, dummyUpdate]);

  const onClickOutside = () => {
    if (!isVisible(state.selection)) {
      setModalOpen(false);
    }
  };
  const domRect = posToDOMRect(view, from, to);
  if (!domRect) {
    return null;
  }
  const width = editor.view.dom.clientWidth;
  if (width === 0) {
    return null;
  }

  return (
    <ClickOutside onClickOutside={onClickOutside} wrapper="div">
      {isVisible(state.selection) &&
        isModalOpen &&
        ReactDOM.createPortal(
          <div
            ref={floating}
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              zIndex: 10000,
            }}
          >
            <div data-id="ricos-floating-toolbar" tabIndex={-1}>
              {children()}
            </div>
          </div>,
          portal
        )}
    </ClickOutside>
  );
};
