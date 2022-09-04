import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { RicosContext, ModalContext } from 'ricos-context';
import type { IToolbarItem } from 'ricos-types';
import { Node_Type } from 'ricos-types';
import { ToggleButton, EditIcon } from 'wix-rich-content-toolbars-ui';

type Props = {
  toolbarItem: IToolbarItem;
  dataHook?: string;
};

const HTML_EDIT_MODAL_ID = `${Node_Type.HTML}.edit`;

export const EditHtmlButton: FC<Props> = ({ toolbarItem, dataHook }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const { t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext);

  const node = toolbarItem.attributes.selectedNode;

  const componentData = {
    srcType: node?.attrs?.html ? 'html' : 'url',
    src: node?.attrs?.html || node?.attrs?.url,
    config: {
      isAdsense: node?.attrs?.isAdsense,
    },
  }; //TODO: use convertor

  const updateData = data => {
    const htmlData = data.srcType === 'html' ? { html: data.src } : { url: data.src };
    toolbarItem.commands?.click({ htmlData });
  };

  const onClick = () => {
    const isModalOpen = modalService.isModalOpen(HTML_EDIT_MODAL_ID);
    isModalOpen
      ? modalService.closeModal(HTML_EDIT_MODAL_ID)
      : modalService.openModal(HTML_EDIT_MODAL_ID, {
          componentProps: {
            componentData,
            updateData,
            close: () => modalService.closeModal(HTML_EDIT_MODAL_ID),
          },
          layout: 'popover',
          positioning: { referenceElement, placement: 'bottom' },
        });
  };

  return (
    <div ref={setReferenceElement}>
      <ToggleButton
        dataHook={dataHook}
        Icon={EditIcon}
        label={t('HtmlPlugin_EditHtml_Tooltip')}
        tooltip={t('HtmlPlugin_EditHtml_Tooltip')}
        onClick={onClick}
      />
    </div>
  );
};
