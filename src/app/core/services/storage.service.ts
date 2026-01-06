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
  private readonly dbPromise: Promise<IDBPDatabase<MusicDB>>;


  constructor() {
    this.dbPromise = openDB<MusicDB>('MusicStreamDB', 1, {
      upgrade(db) {
        if(!db.objectStoreNames.contains('tracks')) {
          const store = db.createObjectStore('tracks', { keyPath: 'id'});
          store.createIndex('by-date', 'createdAt');
        }
      }
    });
  }

  async addTrack(track: TrackModel): Promise<void> {
    const db = await  this.dbPromise;
    await db.put('tracks', track);
  }

  async getAllTracks() {
    const db = await this.dbPromise;
    return await db.getAll('tracks');
  }

  async getTrack(id: string): Promise<TrackModel | undefined> {
    const db = await this.dbPromise;
    return await db.get('tracks', id);
  }

  async deleteTrack(id: string) {
    const db = await this.dbPromise;
    await db.delete('tracks', id);
  }
}
