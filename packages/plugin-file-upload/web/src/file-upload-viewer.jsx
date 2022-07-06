import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEqual, debounce, pick } from 'lodash';
import { mergeStyles, validate, GlobalContext } from 'wix-rich-content-common';
import { LoaderIcon, getIcon, DownloadIcon, ErrorIcon, ReadyIcon } from './icons';
// eslint-disable-next-line max-len
import pluginFileUploadSchema from 'wix-rich-content-common/dist/statics/schemas/plugin-file-upload.schema.json';
import styles from '../statics/styles/file-upload-viewer.scss';
import Tooltip from 'wix-rich-content-common/libs/Tooltip';
import classnames from 'classnames';
import { FILE_UPLOAD_TYPE } from './types';
import { PDF_STATUS, PDF_OPTIONS, PDFViewer } from './pdfViewer';

const getNameWithoutType = fileName => {
  if (!fileName || !fileName.includes('.')) {
    return fileName;
  }
  const s = fileName.split('.');
  return s.slice(0, s.length - 1).join('.');
};

const resizeWidths = { first: 320, second: 140, third: 100 };

class FileUploadViewer extends PureComponent {
  static contextType = GlobalContext;

  constructor(props) {
    super(props);
    const {
      componentData,
      componentData: { type, pdfSettings },
      settings: { adobeAPIKey },
    } = props;
    const viewMode = pdfSettings?.viewMode || PDF_OPTIONS.NONE;
    validate(componentData, pluginFileUploadSchema);
    this.downloaderRef = React.createRef();
    this.fileUploadViewerRef = React.createRef();
    const pdfStatus =
      type === 'pdf' && viewMode !== PDF_OPTIONS.NONE && adobeAPIKey
        ? PDF_STATUS.PENDING
        : PDF_STATUS.NONE;
    this.state = {
      resolvedFileUrl: null,
      resolvingUrl: false,
      currentWidth: 0,
      pdfStatus,
    };
  }

  isInResizeRange = resizeWidth => this.fileUploadViewerRef?.current?.clientWidth < resizeWidth;

  componentWillReceiveProps(nextProps) {
    const {
      componentData: nextComponentData,
      settings: { adobeAPIKey },
    } = nextProps;
    const { componentData } = this.props;
    if (!isEqual(nextComponentData, componentData)) {
      validate(nextComponentData, pluginFileUploadSchema);
    }
    if (!nextProps.isLoading && this.props.isLoading) {
      this.switchReadyIcon();
    }
  }

  componentDidMount() {
    if (window?.ResizeObserver) {
      this.resizer = new ResizeObserver(
        debounce(entries => {
          this.setState({ currentWidth: Math.round(entries[0].contentRect.width) });
        }, 60)
      );
    }
    this.resizer.observe(this.fileUploadViewerRef.current);
  }

  componentWillUnmount() {
    this.resizeObserver?.unobserve(this.fileUploadViewerRef.current);
  }

  switchReadyIcon = () => {
    return this.setState({ showReadyIcon: true }, () =>
      setTimeout(() => this.setState({ showReadyIcon: false }), 2000)
    );
  };

  renderContainerWithoutLink = () => {
    const { tempDataPlaceHolder, componentData } = this.props;
    const { name, type } = tempDataPlaceHolder ? tempDataPlaceHolder : componentData;
    return (
      <div
        className={classnames(this.styles.file_upload_link, {
          [this.styles.width_three]: this.isInResizeRange(resizeWidths.third),
        })}
      >
        {this.renderViewerBody({ name, type })}
      </div>
    );
  };

  renderIcon = Icon => {
    const {
      isLoading,
      isMobile,
      componentData: { error },
    } = this.props;
    const { showReadyIcon, resolvingUrl, pdfStatus } = this.state;
    const showLoader = isLoading || resolvingUrl || pdfStatus === PDF_STATUS.LOADING_FILE;
    const showFileIcon = (!showLoader && !showReadyIcon && isMobile) || (!isMobile && Icon);
    if (showFileIcon) {
      return (
        <Icon
          styles={this.styles}
          className={classnames(this.styles.file_upload_type_icon, {
            [this.styles.width_three]: this.isInResizeRange(resizeWidths.third),
          })}
        />
      );
    } else {
      return (
        <div className={isMobile ? this.styles.mobile_status_icon : this.styles.file_upload_state}>
          {error ? (
            <ErrorIcon />
          ) : showLoader ? (
            <LoaderIcon className={this.styles.file_loader_icon} />
          ) : showReadyIcon ? (
            <ReadyIcon />
          ) : (
            !this.isInResizeRange(resizeWidths.first) && <DownloadIcon />
          )}
        </div>
      );
    }
  };

  sizeToString = size => {
    return size < 1000
      ? size + 'B'
      : size < 1000000
      ? Math.round(size / 1000) + 'KB'
      : (size / 1000000).toFixed(2) + 'MB';
  };

  getFileInfoString(type) {
    const { componentData, t, isLoading, tempDataPlaceHolder } = this.props;
    const { resolvingUrl } = this.state;
    if (componentData.error) {
      return {
        infoString: t('UploadFile_Error_Generic_Item'),
        infoStyle: this.styles.file_upload_text_error,
      };
    }
    const translationKey =
      isLoading || resolvingUrl ? 'UploadFile_Viewer_Loader' : 'UploadFile_Viewer_Download';
    let infoString = t(translationKey, {
      fileType: type?.toUpperCase(),
    });
    const size = componentData.size || tempDataPlaceHolder?.size;
    if (size) {
      infoString = infoString + ' • ' + this.sizeToString(size);
    }
    return { infoString, infoStyle: this.styles.file_upload_type };
  }

  renderViewerBody({ name, type }) {
    const { isMobile } = this.props;
    const nameWithoutType = getNameWithoutType(name);
    const Icon = getIcon(type);
    const { infoString, infoStyle } = this.getFileInfoString(type);
    return (
      <>
        {this.renderIcon(Icon)}
        {!isMobile && this.renderIcon()}
        {!this.isInResizeRange(resizeWidths.third) && (
          <div
            className={classnames(this.styles.file_upload_text_container, {
              [this.styles.width_two]: this.isInResizeRange(resizeWidths.second),
            })}
          >
            <div className={this.styles.file_upload_name_container}>
              {!this.isInResizeRange(resizeWidths.second) && (
                <div className={this.styles.file_upload_name}>{nameWithoutType}</div>
              )}
              {type && (
                <div
                  className={classnames(this.styles.file_upload_extension, {
                    [this.styles.width_one]: this.isInResizeRange(resizeWidths.first),
                  })}
                >
                  {'.' + type}
                </div>
              )}
            </div>
            <div className={infoStyle}>{infoString}</div>
          </div>
        )}
      </>
    );
  }

  renderViewer(fileUrl) {
    const {
      componentData: { name, type, error },
      tempDataPlaceHolder,
    } = this.props;
    const { downloadTarget } = this.props.settings;

    if (error || tempDataPlaceHolder) {
      return this.renderContainerWithoutLink();
    }
    return (
      <a
        href={fileUrl}
        target={downloadTarget}
        className={classnames(this.styles.file_upload_link, {
          [this.styles.width_three]: this.isInResizeRange(resizeWidths.third),
        })}
        onClick={this.onFileClick}
      >
        {this.renderViewerBody({ name, type })}
      </a>
    );
  }

  getExperiments = () => this.props.experiments || this.context.experiments;

  renderFileUrlResolver() {
    const {
      componentData,
      settings: { resolveFileUrl },
    } = this.props;
    const { name, type, error } = componentData;

    if (error) {
      return this.renderContainerWithoutLink();
    }

    const fileUrlResolver = () => {
      const { resolvingUrl } = this.state;
      if (!resolvingUrl) {
        this.setState({ resolvingUrl: true });
        resolveFileUrl(componentData).then(resolvedFileUrl => {
          this.setState({ resolvedFileUrl, resolvingUrl: false }, this.switchReadyIcon);

          if (this.downloaderRef.current) {
            if (this.getExperiments().useFilePluginAutoDownloadLinkRef?.enabled) {
              this.downloaderRef.current.href = resolvedFileUrl;
              this.downloaderRef.current.download = name;
              this.downloaderRef.current.click();
            } else {
              this.downloaderRef.current.src = resolvedFileUrl;
            }
          }
        });
      }
    };

    const resolveIfEnter = ev => {
      const enterEvent = 13;
      if (ev.which === enterEvent) {
        fileUrlResolver();
      }
    };

    return (
      <div
        onClick={fileUrlResolver}
        onKeyDown={resolveIfEnter}
        role="button"
        tabIndex={0}
        className={classnames(this.styles.file_upload_link, {
          [this.styles.width_three]: this.isInResizeRange(resizeWidths.third),
        })}
      >
        {this.renderViewerBody({ name, type })}
      </div>
    );
  }

  renderAutoDownloadLinkRef() {
    const {
      settings: { resolveFileUrl: withFileUrlResolver, downloadTarget },
    } = this.props;

    if (!withFileUrlResolver) {
      return null;
    }

    const target = downloadTarget || '_blank';
    const experiments = this.getExperiments();

    const loading = experiments.lazyImagesAndIframes?.enabled ? 'lazy' : undefined;
    return experiments.useFilePluginAutoDownloadLinkRef?.enabled ? (
      <a href="#0" ref={this.downloaderRef} style={{ display: 'none' }} target={target}>
        <></>
      </a>
    ) : (
      <iframe ref={this.downloaderRef} style={{ display: 'none' }} title="file" loading={loading} />
    );
  }

  onFileClick = () => this.props.helpers.onViewerAction?.(FILE_UPLOAD_TYPE, 'Click');

  onPDFStatusChange = status => this.setState({ pdfStatus: status });

  render() {
    const {
      componentData,
      componentData: { pdfSettings = {} },
      theme,
      setComponentUrl,
      tempDataPlaceHolder,
      settings: { adobeAPIKey },
      locale,
      iframeSandboxDomain,
    } = this.props;
    const { pdfStatus } = this.state;
    this.styles = this.styles || mergeStyles({ styles, theme });
    const fileUrl = componentData.url || this.state.resolvedFileUrl;
    setComponentUrl?.(fileUrl);
    const viewer =
      fileUrl || tempDataPlaceHolder ? this.renderViewer(fileUrl) : this.renderFileUrlResolver();
    const dataHook = 'fileUploadViewer';

    const shouldRenderPDFViewer =
      this.getExperiments().enableFilePluginPDFViewer?.enabled &&
      typeof window !== 'undefined' &&
      fileUrl &&
      ![PDF_STATUS.ERROR].includes(pdfStatus);

    const style = classnames(
      this.styles.file_upload_container,
      componentData.error && this.styles.file_upload_error_container
    );

    return (
      <Tooltip
        content={this.isInResizeRange(resizeWidths.first) && componentData.name}
        tooltipOffset={{ y: 25 }}
      >
        {shouldRenderPDFViewer ? (
          <div data-hook={dataHook} ref={this.fileUploadViewerRef}>
            <PDFViewer
              status={pdfStatus}
              fileData={{ url: fileUrl, fileName: componentData.name }}
              setStatus={this.onPDFStatusChange}
              pdfSettings={pdfSettings}
              config={{
                clientId: adobeAPIKey,
                locale,
              }}
            />
            {![PDF_STATUS.READY].includes(pdfStatus) && <div className={style}>{viewer}</div>}
          </div>
        ) : (
          <div data-hook={dataHook} ref={this.fileUploadViewerRef} className={style}>
            {viewer}
            {this.renderAutoDownloadLinkRef()}
          </div>
        )}
      </Tooltip>
    );
  }
}

FileUploadViewer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  componentData: PropTypes.object.isRequired,
  tempDataPlaceHolder: PropTypes.object,
  settings: PropTypes.object,
  theme: PropTypes.object.isRequired,
  setComponentUrl: PropTypes.func,
  t: PropTypes.func,
  isMobile: PropTypes.bool,
  helpers: PropTypes.object,
  locale: PropTypes.string,
  iframeSandboxDomain: PropTypes.string,
  experiments: PropTypes.object,
};

FileUploadViewer.defaultProps = {
  isLoading: false,
  settings: {},
};

export default FileUploadViewer;
