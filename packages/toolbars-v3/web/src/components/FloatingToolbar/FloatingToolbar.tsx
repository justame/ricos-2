/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useFloating, shift, offset, autoUpdate, flip, hide } from '@floating-ui/react-dom';
import { ClickOutside } from '../Clickoutside/ClickOutside';
import type { RicosPortal } from 'ricos-types';

//TODO: remove this import and find solution
import { posToDOMRect } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import type { Selection } from 'prosemirror-state';
import { throttle } from 'lodash';

export const FloatingToolbar = ({
  editor,
  portal,
  isVisible,
  children,
  getReferenceElement,
  zIndex = 1,
  boundary,
}: {
  editor: Editor;
  portal: RicosPortal;
  isVisible: (selection: Selection) => boolean;
  children: any;
  getReferenceElement?: (selectedDomNode) => HTMLElement | null;
  zIndex?: number;
  boundary?: HTMLElement | (() => HTMLElement);
}) => {
  const { state, view } = editor;
  const { from, to } = state.selection;

  const [dummyUpdate, setForceUpdate] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const _boundary =
    (typeof boundary === 'function' ? boundary() : boundary) || editor.view.dom || undefined;
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    placement: 'top',
    middleware: [
      flip({
        boundary: _boundary,
      }),
      shift({
        padding: 10,
        boundary: _boundary,
      }),
      hide({ boundary: _boundary }),
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
  const throttleRender = useCallback(
    throttle(() => {
      forceUpdate();
    }, 300),
    []
  );

  useEffect(() => {
    editor.on('selectionUpdate', () => {
      setModalOpen(true);
    });
    editor.on('selectionUpdate', throttleRender);
    editor.on('blur', forceUpdate);
    window.addEventListener('resize', throttleRender);

    return () => {
      editor.off('selectionUpdate', throttleRender);
      editor.off('blur', forceUpdate);
      editor.off('focus', forceUpdate);
      window.removeEventListener('resize', throttleRender);
    };
  }, []);

  useEffect(() => {
    // Call reference with the virtual element inside an effect
    const externalRefNode = getReferenceElement && getReferenceElement(editor.view.nodeDOM(from));
    reference({
      getBoundingClientRect() {
        const rect = externalRefNode?.getBoundingClientRect();
        if (rect) {
          return rect;
        }

        const { state, view } = editor;
        const { from, to } = state.selection;

        const domRect = posToDOMRect(view, from, to);

        return domRect;
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
              zIndex,
              visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
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
