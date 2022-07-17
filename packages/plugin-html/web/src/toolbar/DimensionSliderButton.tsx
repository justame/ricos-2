import React, { useContext, useEffect, useState } from 'react';
import type { FC } from 'react';
import SliderModal from './SliderModal';
import type { IToolbarItem } from 'ricos-types';
import { RicosContext, ModalContext, EditorContext } from 'ricos-context';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';

interface Props {
  toolbarItem: IToolbarItem;
  dimension: 'width' | 'height';
  min: number;
  max: number;
  inputMin?: number;
  inputMax?: number;
}

const HTML_DIMENSION_MODAL_ID = 'htmlDimensionModal';

export const DimensionSliderButton: FC<Props> = ({ toolbarItem, dimension, ...props }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const { t, isMobile } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext);
  const id = `${HTML_DIMENSION_MODAL_ID}_${dimension.toUpperCase()}`;

  useEffect(() => {
    !modalService.getModal(id) && modalService.register({ Component: SliderModal, id });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { icon, tooltip } = toolbarItem.presentation as Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const node = (toolbarItem.attributes as Record<string, any>).selectedNode;

  const nodeId = node?.attrs.id;

  const { getEditorCommands } = useContext(EditorContext);
  const getValue = () =>
    getEditorCommands().getBlockComponentData(nodeId).containerData[dimension].custom;

  const onChange = value => {
    const componentData = getEditorCommands().getBlockComponentData(nodeId);
    const containerData = {
      ...componentData.containerData,
      [dimension]: {
        custom: value,
      },
    };
    toolbarItem.commands?.click({ data: { ...componentData, containerData } });
  };

  const onClick = () => {
    if (modalService?.isModalOpen(id)) {
      modalService.closeModal(id);
    } else {
      modalService.openModal(id, {
        componentProps: {
          ...props,
          getValue,
          onChange,
          close: () => modalService.closeModal(id),
        },
        layout: isMobile ? 'drawer' : 'popover',
        positioning: { referenceElement, placement: 'bottom' },
      });
    }
  };

  return (
    <div ref={setReferenceElement}>
      <ToggleButton
        Icon={icon}
        onClick={onClick}
        dataHook={`html_custom_${dimension}_slider`}
        tooltip={t(tooltip)}
      />
    </div>
  );
};

export default DimensionSliderButton;
