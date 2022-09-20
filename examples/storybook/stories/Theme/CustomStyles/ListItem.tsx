import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { CloseButton, Dropdown, Input } from 'wix-style-react';
import type { StyleAttr, CustomStyles } from './types';
import styles from './StylesPanel.scss';
import { throttle } from 'lodash';

interface Props {
  item: StyleAttr;
  updateStyle: (item: StyleAttr) => void;
  close: () => void;
}

const customTextualStyle = [
  'fontSize',
  'fontFamily',
  'fontWeight',
  'fontStyle',
  'textDecoration',
  'lineHeight',
  'minHeight',
  'color',
];
const customQuoteStyle = [
  ...customTextualStyle,
  'borderColor',
  'borderWidth',
  'paddingTop',
  'paddingBottom',
  'paddingInlineStart',
];
const customCodeBlockStyle = ['margin', 'padding', 'fontSize', 'lineHeight'];
const customMentionStyle = ['color', 'backgroundColor'];
const customFooterToolbarStyle = ['marginTop'];
const customButtonStyle = ['color'];

const elementsStyles: CustomStyles = {
  quote: customQuoteStyle,
  codeBlock: customCodeBlockStyle,
  mention: customMentionStyle,
  footerToolbar: customFooterToolbarStyle,
  button: customButtonStyle,
  h1: customTextualStyle,
  h2: customTextualStyle,
  h3: customTextualStyle,
  h4: customTextualStyle,
  h5: customTextualStyle,
  h6: customTextualStyle,
  p: customTextualStyle,
  link: customTextualStyle,
  hashtag: customTextualStyle,
};

const propertyList = (element: keyof typeof elementsStyles) =>
  elementsStyles[element]?.map(value => ({ id: value, value }));

const ListItem: FunctionComponent<Props> = ({ item, updateStyle, close }) => {
  const [element, property, value] = item;
  const incDecValue = (key: string) => {
    const inputRegExpArr = value.match(/^(-*\d+)(px|em)$/);
    if (!inputRegExpArr || (key !== 'ArrowUp' && key !== 'ArrowDown')) {
      return;
    }
    const [, num, unit] = inputRegExpArr;
    const newNum = Number(num) + (key === 'ArrowUp' ? 1 : -1);
    updateStyle([element, property, `${newNum}${unit}`]);
  };
  const keyEventHandler = useCallback(throttle(incDecValue, 10, { leading: false }), [value]);
  return (
    <div className={styles.container}>
      <CloseButton skin="standardFilled" size="medium" onClick={close} className={styles.close} />
      <Dropdown
        placeholder="Element"
        selectedId={element}
        onSelect={({ id }) => updateStyle([id as keyof CustomStyles, property, value])}
        options={Object.keys(elementsStyles)
          .sort()
          .map(value => ({ id: value, value }))}
      />
      <Dropdown
        placeholder="Property"
        selectedId={property}
        onSelect={({ id }) => updateStyle([element, id as string, value])}
        options={propertyList(element)}
      />
      <Input
        placeholder="Value"
        value={value}
        onChange={e => updateStyle([element, property, e.currentTarget.value])}
        onKeyDown={e => keyEventHandler(e.key)}
      />
    </div>
  );
};

export default ListItem;
