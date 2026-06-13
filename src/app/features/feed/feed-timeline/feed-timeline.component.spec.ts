import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedTimelineComponent } from './feed-timeline.component';

describe('FeedTimelineComponent', () => {
  let component: FeedTimelineComponent;
  let fixture: ComponentFixture<FeedTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedTimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedTimelineComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
