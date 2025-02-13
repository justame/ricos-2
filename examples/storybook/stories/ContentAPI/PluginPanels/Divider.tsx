import type { FC } from 'react';
import React, { useState } from 'react';
import { Layout, Cell, Button, Dropdown, Typography as t } from 'wix-style-react';
import type { DividerData_Alignment, DividerData_Width, DividerData_LineStyle } from 'ricos-schema';
import {
  emptyCommonBuilderFields,
  emptyPluginContainerData,
  PNLCommonFields,
  PNLContainerData,
} from '../AbstractPanels';
import {
  alignmentOptions,
  alignments,
  dividerTypes,
  dividerTypesOptions,
  dividerWidth,
  dividerWidthOptions,
} from '../AbstractPanels/utils';
import type { EditPanelProps } from '../types';
import { HorizontalField } from '../HorizontalField';

export const Divider: FC<EditPanelProps<'addDivider'>> = ({ addFunc }) => {
  const [commonFields, setCommonFields] = useState(emptyCommonBuilderFields);
  const [alignment, setAlignment] = useState('CENTER' as DividerData_Alignment);
  const [lineStyle, setType] = useState('SINGLE' as DividerData_LineStyle);
  const [width, setWidth] = useState('LARGE' as DividerData_Width);
  const [containerData, setContainerData] = useState(emptyPluginContainerData);
  const onAdd = () => {
    addFunc('addDivider', {
      data: {
        containerData,
        alignment,
        lineStyle,
        width,
      },
      ...commonFields,
    });
  };
  return (
    <Layout>
      <Cell>
        <p className={t.h1}>Divider</p>
        <HorizontalField label="alignment">
          <Dropdown
            placeholder="alignment"
            selectedId={alignments.indexOf(alignment)}
            options={alignmentOptions}
            onSelect={({ id }) => setAlignment(alignments[id])}
          />
        </HorizontalField>
        <HorizontalField label="type">
          <Dropdown
            placeholder="type"
            selectedId={dividerTypes.indexOf(lineStyle)}
            options={dividerTypesOptions}
            onSelect={({ id }) => setType(dividerTypes[id])}
          />
        </HorizontalField>
        <HorizontalField label="width">
          <Dropdown
            placeholder="width"
            selectedId={dividerWidth.indexOf(width)}
            options={dividerWidthOptions}
            onSelect={({ id }) => setWidth(dividerWidth[id])}
          />
        </HorizontalField>
        <PNLContainerData obj={containerData} setter={setContainerData} />
        <PNLCommonFields obj={commonFields} setter={setCommonFields} />
        <Button onClick={onAdd}>Add</Button>
      </Cell>
    </Layout>
  );
};
