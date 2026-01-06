import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TrackService} from '../../core/services/track.service';
import {AudioPlayerService} from '../../core/services/audio-player.service';
import {getAudioDuration, validateAudioFile} from '../../core/utils/file-utils';
import {TrackModel} from '../../core/model/track.model';

@Component({
  selector: 'app-library',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library {
  trackService = inject(TrackService);
  playerService = inject(AudioPlayerService);
  private fb = inject(FormBuilder);

  isModalOpen = signal(false);
  isSubmitting = signal(false);
  uploadError = signal<string | null>(null);

  trackForm = this.fb.group({
    title: ['', Validators.required, Validators.maxLength(50)],
    artist: ['', Validators.required],
    description: ['', Validators.maxLength(200)],
    category: ['Pop', Validators.required]
  });

  selectedAudioFile: File  | null = null;
  selectedCoverFile: File | null = null;
  audioDuration = 0;


  openModal() {
    this.isModalOpen.set(true);
    this.uploadError.set(null);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.trackForm.reset();
    this.selectedAudioFile = null;
    this.selectedCoverFile = null;
  }

  async onAudioSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      const file = input.files[0];

      const error = validateAudioFile(file);
      if(error) {
        this.uploadError.set(error);
        this.selectedAudioFile = null;
        return;
      }

      try {
        this.uploadError.set(null);
        this.audioDuration = await getAudioDuration(file);
        this.selectedAudioFile = file;
      } catch (err) {
        this.uploadError.set("Erreur lors de la lecture du fichier audio");
      }
    }
  }

  onCoverSelected(event: Event) {}

  async onSubmit() {}

  playTrack(track: TrackModel) {
    this.playerService.playTrack(track);
  }

}
