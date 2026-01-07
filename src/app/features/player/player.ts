import {Component, inject} from '@angular/core';
import {AudioPlayerService} from '../../core/services/audio-player.service';
import {DurationPipe} from '../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-player',
  imports: [
    DurationPipe
  ],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  playerService = inject(AudioPlayerService);

  currentTrack = this.playerService.currentTrack;
  isPlaying = this.playerService.isPlaying;
  currentTime = this.playerService.currentTime;
  duration = this.playerService.duration;

  get volume() { return this.playerService.state().volume; }




  togglePlay() {
    this.playerService.togglePlay()
  }

  onSeek(event: Event) {
    const input = event.target as HTMLInputElement;
    this.playerService.seekTo(Number(input.value));
  }

  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.playerService.setVolume(Number(input.value))
  }

  async next() {
    await this.playerService.playNext();
  }

  async previous() {
    await this.playerService.playPrevious();
  }
}
