import { testImages, testWixVideos } from './mock';
import { mockAudioData } from './mockAudioData';
import { FILE_URLS } from './fileMockURL';

export const mockImageNativeUploadFunc = (files, updateEntity) => {
  const mockImageIndex = Math.floor(Math.random() * testImages.length);
  const testItem = testImages[mockImageIndex];
  const data = {
    id: testItem.photoId,
    original_file_name: files && files[0] ? files[0].name : testItem.url,
    file_name: testItem.url,
    width: testItem.metadata.width,
    height: testItem.metadata.height,
  };
  setTimeout(() => {
    updateEntity({ data, files });
    console.log('consumer uploaded', data);
  }, 2000);
};

export const mockImageUploadFunc = (index, multiple, updateEntity, removeEntity, componentData) => {
  const shouldMultiSelectImages = false;
  const count = componentData.items || shouldMultiSelectImages ? [1, 2, 3] : [1];
  const data = [];
  count.forEach(_ => {
    const testItem = testImages[Math.floor(Math.random() * testImages.length)];
    data.push({
      id: testItem.photoId,
      original_file_name: testItem.url,
      file_name: testItem.url,
      width: testItem.metadata.width,
      height: testItem.metadata.height,
    });
  });
  setTimeout(() => {
    updateEntity({ data });
  }, 500);
};

export const mockFileNativeUploadFunc = (file, updateEntity) => {
  const name = file.name;
  let type;
  if (name && name.includes('.')) {
    if (name && name.includes('.')) {
      const currentType = name.split('.').pop();
      type = FILE_URLS[currentType] ? currentType : 'pdf';
    }
  }
  const size = file.size;

  const data = {
    name,
    type,
    url: FILE_URLS[type],
    size,
  };
  setTimeout(() => updateEntity({ data }), 5000);
};

export const mockFileUploadFunc = updateEntity => {
  const multiple = false;
  const count = multiple ? [1, 2, 3] : [1];
  const data = [];
  const filenames = ['image.jpg', 'document.pdf', 'music.mp3'];
  count.forEach(_ => {
    const name = filenames[Math.floor(Math.random() * filenames.length)];
    let type;
    if (name && name.includes('.')) {
      type = name.split('.').pop();
    }
    data.push({
      name,
      type,
      url: FILE_URLS[type],
      size: 150000,
    });
  });
  setTimeout(() => updateEntity({ data }), 1000);
};

export const mockCustomVideoUploadFunc = (updateEntity, removeEntity) => {
  console.log('consumer wants to upload custom video');
  const videoToUpload = getVideoToUpload(
    '11062b_a552731f40854d16a91627687fb8d1a6',
    '11062b_a552731f40854d16a91627687fb8d1a6f000.jpg'
  );
  setTimeout(() => {
    updateEntity({ data: videoToUpload });
    console.log('consumer uploaded ', videoToUpload);
  }, 500);
};

export const mockVideoNativeUploadFunc = (file, updateEntity, removeEntity) => {
  console.log('consumer wants to upload custom video', file);
  const mockVideoIndex = Math.floor(Math.random() * testWixVideos.length);
  const testVideo = testWixVideos[mockVideoIndex];
  const videoToUpload = getVideoToUpload(testVideo.url, testVideo.metadata.posters[0].url);
  setTimeout(() => {
    updateEntity({ data: videoToUpload });
    console.log('consumer uploaded ', videoToUpload);
  }, 5000);
};

export const getVideoToUpload = (url, thumbnailUrl) => {
  const videoWithAbsoluteUrl = {
    url: 'https://video.wixstatic.com/video/11062b_a552731f40854d16a91627687fb8d1a6/1080p/mp4/file.mp4',
  };
  const videoWithRelativeUrl = {
    pathname: `video/${url}/1080p/mp4/file.mp4`,
    thumbnail: {
      pathname: `media/${thumbnailUrl}`,
      height: 1080,
      width: 1920,
    },
  };
  // You can provide either absolute or relative URL.
  // If relative URL is provided, a function 'getVideoUrl' will be invoked to form a full URL.
  return videoWithRelativeUrl;
};

export const mockCustomAudioUploadFunc = (
  updateEntity,
  removeEntity,
  fromSettings,
  componentData
) => {
  console.log('consumer wants to upload custom audio');
  if (fromSettings) {
    return mockImageUploadFunc(undefined, false, updateEntity, undefined, componentData);
  }
  const audioToUpload = getAudioToUpload('f0f74f_35a1cdce4973490eac49e74c3244364d');
  setTimeout(() => {
    updateEntity({ data: audioToUpload });
    console.log('consumer uploaded ', audioToUpload);
  }, 500);
};

export const mockAudioNativeUploadFunc = (file, updateEntity, removeEntity) => {
  console.log('consumer wants to upload custom audio', file);
  const mockAudioIndex = Math.floor(Math.random() * mockAudioData.length);
  const testAudio = mockAudioData[mockAudioIndex];
  const audioToUpload = getAudioToUpload(testAudio.url);
  setTimeout(() => {
    updateEntity({ data: audioToUpload });
    console.log('consumer uploaded ', audioToUpload);
  }, 5000);
};

export const getAudioToUpload = url => {
  const audioWithAbsoluteUrl = {
    url: 'https://static.wixstatic.com/mp3/f0f74f_35a1cdce4973490eac49e74c3244364d.mp3',
  };
  const audioWithRelativeUrl = {
    audio: { src: { id: `mp3/${url}.mp3` } },
    name: 'Dear Fear',
    authorName: 'KOTA The Friend',
  };
  // You can provide either absolute or relative URL.
  // If relative URL is provided, a function 'getVideoUrl' will be invoked to form a full URL.
  return audioWithRelativeUrl;
};

export const getVideoUrl = src => `https://video.wixstatic.com/${src.pathname}`;

export const getAudioUrl = src => `https://static.wixstatic.com/${src.id}`;
