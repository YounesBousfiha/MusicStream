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

  state = signal<PlayerState>({
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


  /* async playTrack(track: TrackModel) {
    if(this.state().currentTrack?.id === track.id) {
      this.togglePlay();
    }
  }*/

  async playTrack(track: TrackModel) {
    if (!track.file || track.file.size === 0) {
      console.error("❌ Error: File is empty or missing!");
      return;
    }

    this.audio.pause();

    if (this.currentObjectUrl) {
      console.log("3. Revoking old URL");
      URL.revokeObjectURL(this.currentObjectUrl);
    }

    try {
      this.currentObjectUrl = URL.createObjectURL(track.file);

      this.audio.src = this.currentObjectUrl;
      this.audio.volume = this.state().volume;

      this.audio.load();

      this.updateState({
        currentTrack: track,
        status: 'buffering',
        currentTime: 0
      });

      await this.audio.play();

      this.updateState({ isPlaying: true, status: 'playing' });

    } catch (error: any) {
      console.error("❌ PLAYBACK FAILED:", error);
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);

      this.updateState({
        isPlaying: false,
        status: 'error',
        error: error.message
      });

      if (error.name === 'NotAllowedError') {
        alert("Autoplay Blocked: Browser needs a user interaction first.");
      } else if (error.name === 'NotSupportedError') {
        alert("Format Error: The browser cannot play this audio file.");
      }
    }
  }

  async togglePlay() {
    const isPlaying = this.state().isPlaying;
    if(isPlaying) {
      this.audio.pause();
      this.updateState({ isPlaying: false, status: 'paused'});
      console.log("Pause");
    } else {
      if(!this.state().currentTrack) {
        return;
      }

    try {
      await this.audio.play();
      this.updateState({ isPlaying: true, status: 'playing'});
      console.log("resumed")
    } catch (err) {
      console.error("Resume failed:", err);
      this.updateState({ isPlaying: false, status: 'error'})
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
