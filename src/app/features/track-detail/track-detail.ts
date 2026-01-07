import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, DecimalPipe, Location} from '@angular/common';
import {TrackService} from '../../core/services/track.service';
import {AudioPlayerService} from '../../core/services/audio-player.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TrackModel} from '../../core/model/track.model';
import {DurationPipe} from '../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-track-detail',
  imports: [
    ReactiveFormsModule,
    DurationPipe,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './track-detail.html',
  styleUrl: './track-detail.css',
})
export class TrackDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location)
  private trackService = inject(TrackService);
  private playerService = inject(AudioPlayerService);
  private fb = inject(FormBuilder);

  track = signal<TrackModel | undefined>(undefined);
  isEditing = signal(false);
  isSubmitting = signal(false);

  editForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', [Validators.required]],
    description: ['', [Validators.maxLength(200)]],
    category: ['', [Validators.required]]
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id) {
        this.loadTrack(id);
      }
    });
  }

  loadTrack(id: string) {
    const foundTrack = this.trackService.getTrackById(id);
    if(foundTrack) {
      this.track.set(foundTrack);

      this.editForm.patchValue({
        title: foundTrack.title,
        artist: foundTrack.artist,
        description: foundTrack.description,
        category: foundTrack.category
      });
    }  else {
      this.router.navigate(['/library']);
    }
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
    if(!this.isEditing() && this.track()) {
      this.editForm.patchValue(this.track as any)
    }
  }

  async saveChanges() {
    if (this.editForm.invalid || !this.track()) return;

    this.isSubmitting.set(true);

    const updatedTrack: TrackModel = {
      ...this.track()!,
      title: this.editForm.value.title!,
      artist: this.editForm.value.artist!,
      description: this.editForm.value.description!,
      category: this.editForm.value.category!
    };

    await this.trackService.updateTrack(updatedTrack);

    this.track.set(updatedTrack);
    this.isEditing.set(false);
    this.isSubmitting.set(false);
  }

  async playThis() {
    if(this.track()) {
      await this.playerService.playTrack(this.track()!);
    }
  }

  goBack() {
    this.location.back();
  }


}
