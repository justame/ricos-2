import type { DBSchema } from 'idb';
import { openDB } from 'idb';
import type { AsyncPublishingMetadata, SyncPublishingMetadata } from './ricos-event-logger';

interface EventMetadataDB extends DBSchema {
  'ricos-events': {
    value: SyncPublishingMetadata | AsyncPublishingMetadata;
    key: number;
    indexes: {
      'by-topic': string;
      'by-timestamp': Date;
      'by-duration': number;
    };
  };
}

export const dbLogger = async () => {
  const db = await openDB<EventMetadataDB>('ricos-events', 1, {
    upgrade(db) {
      const store = db.createObjectStore('ricos-events', {
        keyPath: 'eventId',
        autoIncrement: true,
      });
      store.createIndex('by-topic', 'topic');
      store.createIndex('by-timestamp', 'timestamp');
      store.createIndex('by-duration', 'duration');
    },
  });

  db.clear('ricos-events');

  return {
    log(metadata: SyncPublishingMetadata | AsyncPublishingMetadata) {
      db.put('ricos-events', metadata);
    },
  };
};
