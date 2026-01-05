import {DBSchema, IDBPDatabase, openDB} from 'idb';
import {TrackModel} from '../model/track.model';
import {Injectable} from '@angular/core';

interface MusicDB extends DBSchema {
  tracks: {
    key: string;
    value: TrackModel
    indexes: { 'by-date': Date}
  }
}



@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbPromise: Promise<IDBPDatabase<MusicDB>>;


  constructor() {
    this.dbPromise = openDB<MusicDB>('MusciStreamDB', 1, {
      upgrade(db) {
        if(!db.objectStoreNames.contains('tracks')) {
          const store = db.createObjectStore('tracks', { keyPath: 'id'});
          store.createIndex('by-date', 'createdAt');
        }
      }
    });
  }
}
