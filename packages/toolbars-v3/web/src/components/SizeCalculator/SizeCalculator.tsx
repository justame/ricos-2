import React, { useState, useRef, useEffect } from 'react';
import { ToolbarButtons } from '../../models';

type SizeResult = {
  visibleButtons: ToolbarButtons;
  overflowedButtons: ToolbarButtons;
};

type SizeCalculatorProps = {
  width: number;
  toolbarButtons: ToolbarButtons;
  children: (result: SizeResult) => unknown;
};

const MORE_BUTTON_WIDTH = 80;
const GAP_BETWEEN_BUTTONS = 4;

const Overflow = ({
  width,
  toolbarButtons,
  onChange,
}: {
  width: number;
  toolbarButtons: ToolbarButtons;
  onChange;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sumVisible = 0;
    const visibleButtons: ToolbarButtons = new ToolbarButtons([]);
    const overflowedButtons: ToolbarButtons = new ToolbarButtons([]);

    if (containerRef.current) {
      const elements = Array.from(containerRef.current.children).map((child: HTMLElement) => {
        return {
          child,
          width: Math.ceil(child.getBoundingClientRect().width),
        };
      });
      let stackIsFull = false;
      elements.forEach((element, index) => {
        if (!stackIsFull && sumVisible + element.width <= width - MORE_BUTTON_WIDTH) {
          visibleButtons.addButton(toolbarButtons.getButtonByIndex(index));

          sumVisible += element.width + GAP_BETWEEN_BUTTONS;
        } else {
          stackIsFull = true;
          overflowedButtons.addButton(toolbarButtons.getButtonByIndex(index));
        }
      });
      onChange({
        visibleButtons,
        overflowedButtons,
      });
    }
  }, [width, toolbarButtons]);

  return (
    <div style={{ visibility: 'hidden', position: 'absolute', display: 'flex' }} ref={containerRef}>
      {toolbarButtons.getButtonsElements()}
    </div>
  );
};

export const SizeCalculator = ({ width, toolbarButtons, children }: SizeCalculatorProps) => {
  const [data, setData] = useState<SizeResult>();

  const onChange = data => {
    setData(data);
  };

  return (
    <>
      <Overflow width={Number(width)} toolbarButtons={toolbarButtons} onChange={onChange} />
      {data && children(data)}
    </>
  );
};
