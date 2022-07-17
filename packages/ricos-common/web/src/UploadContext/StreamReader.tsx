import type { ILocalFileReader } from 'ricos-types';

export class StreamReader implements ILocalFileReader {
  read(file: File) {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(file);
        resolve(url);
      } catch (e) {
        reject(e);
      }
    });
  }

  free(url: string) {
    URL.revokeObjectURL(url);
  }
}
