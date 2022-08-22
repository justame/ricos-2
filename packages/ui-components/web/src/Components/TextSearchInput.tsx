import React, { Component } from 'react';
import { SearchIcon, ClearIcon } from '../Icons';
import styles from '../../statics/styles/text-search-input.scss';
import { KEYS_CHARCODE } from '../consts';

interface TextSearchInputProps {
  placeHolder?: string;
  onClose?: () => void;
  onChange: (value: string) => void;
  value?: string;
  id?: string;
  onKeyPress: (e) => void;
  theme?: Record<string, string>;
  autoComplete?: string;
}

export default class TextSearchInput extends Component<TextSearchInputProps> {
  input: HTMLInputElement | null = null;

  componentDidMount() {
    if (this.input) {
      setTimeout(() => this.input?.focus(), 0); // setTimeout is needed for popper to place the modal first
      this.input.setSelectionRange(0, this.input.value.length);
    }
  }

  onChange = e => this.props.onChange(e.target.value);

  onCloseRequested = () => {
    this.props.onClose?.();
  };

  handleKeyPress = e => {
    if (e.charCode === KEYS_CHARCODE.ESCAPE) {
      this.onCloseRequested();
    }
    if (e.charCode === KEYS_CHARCODE.ENTER) {
      const elements = Array.from(
        document.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button,input')
      );
      const searchInputIndex = elements.indexOf(e.target);
      elements[searchInputIndex + 1]?.click();
    }
  };

  handleClearText = () => this.props.onChange('');

  render() {
    const { placeHolder, value } = this.props;
    return (
      <div className={styles.container}>
        <SearchIcon className={styles.prefixIcon} />
        <input
          ref={ref => {
            this.input = ref;
          }}
          className={styles.input}
          placeholder={placeHolder}
          onKeyPress={this.handleKeyPress}
          onChange={this.onChange}
          value={value}
        />
        {value && <ClearIcon className={styles.suffixIcon} onClick={this.handleClearText} />}
      </div>
    );
  }
}
