import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationCardComponent } from './observation-card.component';

describe('ObservationCardComponent', () => {
  let component: ObservationCardComponent;
  let fixture: ComponentFixture<ObservationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
