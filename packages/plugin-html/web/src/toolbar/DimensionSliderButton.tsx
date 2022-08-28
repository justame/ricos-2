import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import type { IToolbarItem } from 'ricos-types';
import { RicosContext, ModalContext, EditorContext } from 'ricos-context';
import { ToggleButton } from 'wix-rich-content-toolbars-ui';
import { HTML_BUTTONS } from '../consts';

interface Props {
  toolbarItem: IToolbarItem;
  dimension: 'width' | 'height';
  min: number;
  max: number;
  inputMin?: number;
  inputMax?: number;
  dataHook?: string;
}

export const DimensionSliderButton: FC<Props> = ({
  toolbarItem,
  dimension,
  dataHook,
  ...props
}) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const { t } = useContext(RicosContext) || {};
  const modalService = useContext(ModalContext);

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
    toolbarItem.commands?.click({ value, data: { ...componentData, containerData } });
  };

  const onClick = () => {
    if (modalService?.isModalOpen(HTML_BUTTONS[dimension])) {
      modalService.closeModal(HTML_BUTTONS[dimension]);
    } else {
      modalService.openModal(HTML_BUTTONS[dimension], {
        componentProps: {
          ...props,
          getValue,
          onChange,
          close: () => modalService.closeModal(HTML_BUTTONS[dimension]),
        },
        layout: 'popover',
        positioning: { referenceElement, placement: 'bottom' },
      });
    }
  };

  return (
    <div ref={setReferenceElement}>
      <ToggleButton Icon={icon} onClick={onClick} dataHook={dataHook} tooltip={t(tooltip)} />
    </div>
  );
};

export default DimensionSliderButton;
