import { TiptapContentResolver } from './ContentResolver';

export const alwaysVisibleResolver = TiptapContentResolver.create('ALWAYS_VISIBLE', () => {
  return true;
});
