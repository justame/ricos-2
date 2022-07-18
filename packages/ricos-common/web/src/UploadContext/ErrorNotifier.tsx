import React, { Component, Suspense } from 'react';
import type { IMessage, INotifier } from 'ricos-types';
const ErrorToast = React.lazy(() => import('wix-rich-content-editor/libs/ErrorToast'));

type ErrorNotifierState = {
  error: IMessage;
  errorCount: number;
};

type ErrorNotifierProps = {
  isMobile?: boolean;
  languageDir?: string;
};

class ErrorNotifier extends Component<ErrorNotifierProps, ErrorNotifierState> implements INotifier {
  timer?: NodeJS.Timeout;

  constructor(props) {
    super(props);
    this.state = { error: {}, errorCount: 0 };
  }

  closeToastAfterDelay = () => {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(this.close, 4000);
  };

  notify = (error: IMessage) => {
    this.setState(state => ({ error, errorCount: state.errorCount + 1 }));
    this.closeToastAfterDelay();
  };

  close = () => {
    this.setState({ errorCount: 0 });
  };

  render() {
    const { error, errorCount } = this.state;
    const { isMobile, languageDir } = this.props;
    if (errorCount <= 0) {
      return null;
    }
    return (
      <div style={{ display: 'contents' }} dir={languageDir}>
        <Suspense fallback={<div />}>
          <ErrorToast {...{ error, errorCount, onClose: this.close, isMobile }} />;
        </Suspense>
      </div>
    );
  }
}

export default ErrorNotifier;
