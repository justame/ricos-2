/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
import { AUDIO_TYPE } from '../types';
import { audioFileTypes } from '../consts';
import { handleUploadStart, handleUploadFinished, Uploader } from 'wix-rich-content-plugin-commons';
import { MediaUploadModal } from 'wix-rich-content-ui-components';
import { MEDIA_POPOVERS_BUTTONS_NAMES_BI } from 'wix-rich-content-common';
import * as id3 from 'id3js';
import { AudioPluginService as audioPluginService } from '../toolbar/audioPluginService';

const AudioUploadModal = props => {
  const {
    t,
    handleFileSelection,
    handleFileUpload,
    languageDir,
    helpers,
    onConfirm,
    onReplace,
    pubsub,
    componentData,
    closeModal,
    uploadService,
    updateService,
  } = props;

  const id = `AudioUploadModal_FileInput_${Math.floor(Math.random() * 9999)}`;
  let blockKey = componentData?.id;

  const onUpload = obj => {
    if (onConfirm) {
      const { newBlock } = onConfirm(obj);
      blockKey = newBlock.key;
    } else {
      onReplace(obj, blockKey);
    }
  };
  const AudioPluginService = new audioPluginService();

  const uploadContextOnConfirm = data => {
    if (onConfirm) {
      const componentData = AudioPluginService.createPluginData({ data }, props.componentData);
      const { newBlock } = onConfirm({ ...componentData });
      blockKey = newBlock.key;
    } else {
      updateService?.updatePluginData(
        { data },
        blockKey || props.blockKey,
        AUDIO_TYPE,
        AudioPluginService
      );
    }
  };

  const setComponentData = data => {
    pubsub?.set('componentData', data, blockKey);
  };

  const getOnUploadFinished = () => {
    return ({ data, error }) => {
      setComponentData({ ...data, error });
    };
  };

  const addAudioComponent = ({ data, error }) => {
    if (uploadService) {
      uploadContextOnConfirm(data);
    } else {
      handleUploadFinished(
        AUDIO_TYPE,
        getComponentData,
        data,
        error,
        ({ data, error }) => onUpload({ ...data, error }),
        undefined,
        undefined
      );
      setComponentData({ ...getComponentData(), ...data });
    }
  };

  const onLocalLoad = tempData => {
    const { name, authorName, ...rest } = getComponentData();
    const audioDetails = { name: name ?? tempData?.name, authorName };
    onUpload({ ...rest, ...tempData, ...audioDetails });
  };

  const getComponentData = () => {
    const {
      html = null,
      coverImage = null,
      ...rest
    } = { ...componentData, ...pubsub?.get('componentData') };
    return rest;
  };

  const getAudioTags = async file => {
    let tags;
    try {
      tags = await id3.fromFile(file);
    } catch (error) {
      console.error(error);
    }
    return { name: tags?.title, authorName: tags?.artist };
  };

  const handleNativeFileUpload = async file => {
    const tags = await getAudioTags(file);
    if (uploadService) {
      const uploader = new Uploader(props?.handleFileUpload);
      if (onConfirm && !blockKey) {
        const { newBlock } = onConfirm({ ...props.componentData });
        blockKey = newBlock.key;
      }
      setTimeout(() =>
        uploadService.uploadFile(
          file,
          blockKey || props.blockKey,
          uploader,
          AUDIO_TYPE,
          AudioPluginService
        )
      );
    } else {
      handleUploadStart(
        props,
        getComponentData,
        file,
        onLocalLoad,
        getOnUploadFinished(),
        undefined
      );
    }
    setComponentData({ ...getComponentData(), audio: { src: {} }, ...tags });
    closeModal();
  };

  const hasCustomFileUpload = handleFileUpload || handleFileSelection;

  const handleClick = evt => {
    helpers?.onPluginsPopOverClick?.({
      pluginId: AUDIO_TYPE,
      buttonName: MEDIA_POPOVERS_BUTTONS_NAMES_BI.upload,
    });
    if (handleFileSelection) {
      evt.preventDefault();
      return handleFileSelection(({ data, error }) => {
        addAudioComponent({ data, error });
        closeModal();
      });
    }
  };

  return (
    <MediaUploadModal
      id={id}
      handleClick={handleClick}
      handleChange={handleNativeFileUpload}
      languageDir={languageDir}
      title={t('AudioModal_Upload_Title')}
      labelText={t('AudioModal_Upload_ButtonText')}
      dataHook="AudioModalCustomUpload"
      showUploadSection={hasCustomFileUpload}
      accept={audioFileTypes}
    />
  );
};

export default AudioUploadModal;
