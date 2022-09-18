/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import type { RichContentTheme } from 'wix-rich-content-common';
import { TextInput } from '../';
import { KEYS_CHARCODE } from '../consts';
import ModalContainer from './TextInputModalContainer';

const NewUrlInputModal = props => {
  interface ModalProps {
    theme?: RichContentTheme;
    dataHook: string;
    onConfirm: () => void;
    onCloseRequested: (() => void) | undefined;
    submittedInvalidUrl?: any;
    errorMessage: string;
    placeholder: string;
    onInputChange: (text) => void;
    onDoubleClick?: (text) => void;
    input?: string;
  }

  const {
    dataHook,
    onConfirm,
    onCloseRequested,
    submittedInvalidUrl,
    errorMessage,
    placeholder,
    onInputChange,
    input,
    onDoubleClick,
  }: ModalProps = props;
  const InputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = InputRef.current as HTMLInputElement;
    input.setSelectionRange(0, input.value.length);
    setTimeout(() => input.focus(), 0); // setTimeout is needed for popper to place the modal first
  }, []);

  const onUrlChange = url => {
    onInputChange(url);
  };

  const handleKeyPress = event => {
    if (event.charCode === KEYS_CHARCODE.ENTER) {
      onConfirm();
    }
    if (event.charCode === KEYS_CHARCODE.ESCAPE) {
      onCloseRequested?.();
    }
  };

  return (
    <ModalContainer {...props}>
      <TextInput
        inputRef={InputRef}
        type="url"
        id="dropdown-text-input"
        onKeyPress={handleKeyPress}
        onChange={onUrlChange}
        value={input}
        error={submittedInvalidUrl && errorMessage}
        placeholder={placeholder}
        theme={props.theme}
        data-hook={`${dataHook}Input`}
        autoComplete="off"
        onDoubleClick={onDoubleClick}
        style={{ paddingLeft: '12px' }}
      />
    </ModalContainer>
  );
};

export default NewUrlInputModal;
