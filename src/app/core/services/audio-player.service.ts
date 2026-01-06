import {computed, Injectable, signal} from '@angular/core';
import {TrackModel} from '../model/track.model';

interface PlayerState {
  currentTrack: TrackModel | null;
  isPlaying: boolean;
  currenTime: number;
  duration: number;
  volume: number;
  status: 'playing' | 'paused' | 'buffering' | 'stopped';
}


@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audio = new Audio();
  private currentObjectUrl: string | null = null;

  private state = signal<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currenTime: 0,
    duration: 0,
    volume: 0.5,
    status: 'stopped'
  });

  readonly currentTrack = computed(() => this.state().currentTrack);
  readonly isPlaying = computed(() => this.state().isPlaying);
  readonly currentTime = computed(() => this.state().currenTime);
  readonly duration = computed(() => this.state().duration);
  readonly status = computed(() => this.state().status);

  constructor() {
    this.initAudioEvents();
  }

  private initAudioEvents() {
    this.audio.addEventListener('timeupdate', () => {
      this.updateState({ currentTime: this.audio.currentTime});
    });

    this.audio.addEventListener('ended', () => {
      this.updateState({
        isPlaying: false,
        currentTime: 0,
        status: 'stopped'
      });
    });

    this.audio.addEventListener('waiting', () => {
      this.updateState({ status: 'buffering'});
    });

    this.audio.addEventListener('canplay', () => {
      if(this.state().isPlaying) {
        this.updateState({ status: 'playing'});
      } else {
        this.updateState({ status: 'paused'});
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.updateState({ duration: this.audio.duration})
    });
  }


  playTrack(track: TrackModel) {
    if(this.state().currentTrack?.id === track.id) {
      this.togglePlay();
    }
  }

  togglePlay() {
    if(this.state().isPlaying) {
      this.audio.pause();
      this.updateState({ isPlaying: false, status: 'paused'});
    } else {
      if(this.audio.src) {
        this.updateState({ isPlaying: true, status: 'playing'})
      }
    }
  }

  seekTo(seconds: number) {
    this.audio.currentTime = seconds;
    this.updateState({ currentTime: seconds});
  }

  setVolume(value: number) {
    const volume = Math.max(0, Math.min(1, value));
    this.audio.volume = volume;
    this.updateState({ volume });
  }

  private updateState(changes: Partial<PlayerState> | any) {
    this.state.update(current => ({ ...current, ...changes}));
  }
}
