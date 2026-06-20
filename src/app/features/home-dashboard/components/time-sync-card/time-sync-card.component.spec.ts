import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSyncCardComponent } from './time-sync-card.component';

describe('TimeSyncCardComponent', () => {
  let component: TimeSyncCardComponent;
  let fixture: ComponentFixture<TimeSyncCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSyncCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeSyncCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
