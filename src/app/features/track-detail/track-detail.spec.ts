import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDetail } from './track-detail';
import {provideRouter} from '@angular/router';
import {StorageService} from '../../core/services/storage.service';

describe('TrackDetail', () => {
  let component: TrackDetail;
  let fixture: ComponentFixture<TrackDetail>;

  const mockStorageService = {}
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackDetail],
      providers: [
        provideRouter([]),
        { provide: StorageService, useValue: mockStorageService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

 it('should create', () => {
    expect(component).toBeTruthy();
  });
});
