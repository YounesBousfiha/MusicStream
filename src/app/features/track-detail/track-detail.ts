import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {TrackService} from '../../core/services/track.service';
import {AudioPlayerService} from '../../core/services/audio-player.service';
import {FormBuilder, Validators} from '@angular/forms';
import {TrackModel} from '../../core/model/track.model';

@Component({
  selector: 'app-track-detail',
  imports: [],
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
    })
  }

  loadTrack(id: string) {}
}
