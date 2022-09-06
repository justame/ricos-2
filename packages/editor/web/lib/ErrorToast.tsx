import React from 'react';
import { Trans } from 'wix-rich-content-common';
import type { IMessage } from 'ricos-types';
import { ErrorMessageMap } from 'wix-rich-content-common/libs/ErrorMessageMap';
import { Toast } from 'wix-rich-content-ui-components';

type ErrorToastProps = {
  isMobile?: boolean;
  onClose?: () => void;
  error: IMessage;
  errorCount: number;
};

export default function ErrorToast(props: ErrorToastProps) {
  const { errorCount, error, onClose, isMobile } = props;
  const isOpen = errorCount > 0;
  if (!isOpen) {
    return null;
  }

  const translationKey =
    errorCount > 1
      ? 'UploadFile_Error_Generic_Toast_Multiple'
      : error.key && ErrorMessageMap[error.key];
  const upgradeUrl = error.args?.upgradeUrl as string;

  const errorMsg = translationKey ? (
    <Trans i18nKey={translationKey} values={{ ...error.args, errors: errorCount }}>
      {error.msg}
      {upgradeUrl && (
        <a href={upgradeUrl} target="_blank" rel="noreferrer">
          {' '}
        </a>
      )}
    </Trans>
  ) : (
    error.msg
  );

  return <Toast message={errorMsg || ''} isError onClose={onClose} isMobile={isMobile} />;
}
