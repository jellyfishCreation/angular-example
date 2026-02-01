import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieOverview } from './movie-overview';

describe('MovieOverview', () => {
  let component: MovieOverview;
  let fixture: ComponentFixture<MovieOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
