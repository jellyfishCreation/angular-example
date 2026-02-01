import { TestBed } from '@angular/core/testing';

import { GenreApi } from './genre-api';

describe('GenreApi', () => {
  let service: GenreApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenreApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
