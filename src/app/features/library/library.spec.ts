import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Library } from './library';
import {StorageService} from '../../core/services/storage.service';
import {provideRouter} from '@angular/router';

describe('Library', () => {
  let component: Library;
  let fixture: ComponentFixture<Library>;

  const mockStorageService = {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Library],
      providers: [
        provideRouter([]),
        { provide: StorageService, useValue: mockStorageService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Library);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
