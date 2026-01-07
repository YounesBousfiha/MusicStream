import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TrackService} from '../../core/services/track.service';
import {AudioPlayerService} from '../../core/services/audio-player.service';
import {getAudioDuration, validateAudioFile, validateImageFile} from '../../core/utils/file-utils';
import {TrackModel} from '../../core/model/track.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-library',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
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
  searchTerm = signal('');
  selectedCategory = signal('All');

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', Validators.required],
    description: ['', [Validators.maxLength(200)]],
    category: ['Pop', Validators.required]
  });

  selectedAudioFile: File  | null = null;
  selectedCoverFile: File | null = null;
  audioDuration = 0;

  filteredTracks = computed(() => {
    const allTracks = this.trackService.tracks();
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    return allTracks.filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(term) || track.artist.toLowerCase().includes(term);

      const matchesCategory = category === 'All' || track.category === category;

      return matchesSearch && matchesCategory;
    })
  })


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

  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      const file = input.files[0];
      const error = validateImageFile(file);

      if(error) {
        this.uploadError.set(error);
        return;
      }
      this.selectedCoverFile = file;
    }
  }

  async onDeleteTrack(event: Event, track: TrackModel) {
    event.stopPropagation();

    if(confirm(`Voulez-vous vraiment supprimer${track.title} ?`)) {
      await this.trackService.deleteTrack(track.id);
    }

    if(this.playerService.currentTrack()?.id === track.id) {
      await this.playerService.togglePlay();
    }
  }

  async onSubmit() {
    if(this.trackForm.invalid || !this.selectedAudioFile) {
      this.uploadError.set("Veuillez remplir tous les champs obligatroires et ajouter un fichier audio");
      return;
    }

    this.isSubmitting.set(true);

    const newTrack: TrackModel = {
      id: crypto.randomUUID(),
      title: this.trackForm.value.title!,
      artist: this.trackForm.value.artist!,
      description: this.trackForm.value.description! || '',
      category: this.trackForm.value.category!,
      createdAt: new Date(),
      duration: this.audioDuration,
      file: this.selectedAudioFile,
      size: this.selectedAudioFile.size,
    };

    await this.trackService.addTrack(newTrack);

    this.isSubmitting.set(false);
    this.closeModal();
  }

  async playTrack(track: TrackModel) {

    this.playerService.setPlaylist(this.filteredTracks());

    await this.playerService.playTrack(track);
  }

}
