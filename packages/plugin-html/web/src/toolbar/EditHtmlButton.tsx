import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import HtmlEditPanel from './HtmlEditPanelTiptap';
import { EditIcon } from '../icons';

type Props = {
  toolbarItem: IToolbarItem;
};

const HTML_EDIT_MODAL_ID = 'htmlEditModal';

export const EditHtmlButton: FC<Props> = ({ toolbarItem }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const { t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext);

  useEffect(() => {
    modalService.register({ Component: HtmlEditPanel, id: HTML_EDIT_MODAL_ID });
  }, []);

  useEffect(() => modalService.unregister(HTML_EDIT_MODAL_ID), []);

  const nodeAttrs = toolbarItem.attributes.nodeAttrsInSelection;

  const componentData = {
    srcType: nodeAttrs.html ? 'html' : 'url',
    src: nodeAttrs.html || nodeAttrs.url,
  }; //TODO: use convertor

  const updateData = data => {
    const htmlData = data.srcType === 'html' ? { html: data.src } : { url: data.src };
    toolbarItem.commands?.click({ htmlData });
  };

  const onClick = () =>
    modalService.openModal(HTML_EDIT_MODAL_ID, {
      componentProps: {
        componentData,
        updateData,
        close: () => modalService.closeModal(HTML_EDIT_MODAL_ID),
      },
      layout: 'popover',
      positioning: { referenceElement, placement: 'bottom' },
    });

  return (
    <div ref={setReferenceElement}>
      <ToggleButton
        dataHook={'baseToolbarButton_edit'}
        Icon={EditIcon}
        tooltip={t('HtmlPlugin_EditHtml_Tooltip')}
        onClick={onClick}
      />
    </div>
  );
};
