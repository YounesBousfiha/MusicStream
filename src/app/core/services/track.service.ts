import {computed, inject, Injectable, signal} from '@angular/core';
import {routes} from '../../app.routes';
import {StorageService} from './storage.service';
import {TrackModel} from '../model/track.model';

interface TrackState {
  tracks: TrackModel[];
  loading: boolean;
  error: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private storage = inject(StorageService);

  private state = signal<TrackState>({
    tracks: [],
    loading: false,
    error: null,
  });

  readonly tracks = computed(() => this.state().tracks);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().loading);

  constructor() {

    this.loadTracks();
  }

  async loadTracks() {
    this.updateState({ loading: true, error: null});

    try {
      const tracks = await this.storage.getAllTracks();

      this.updateState({ tracks, loading: false})
    } catch (err) {
      this.updateState({ loading: false, error: 'Failed to load Tracks'});
      console.error(err);
    }
  }



  private updateState(changes: Partial<TrackState>) {
    this.state.update(current => ({ ...current, ...changes}));
  }
}
