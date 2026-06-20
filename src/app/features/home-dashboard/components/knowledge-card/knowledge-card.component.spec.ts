import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeCardComponent } from './knowledge-card.component';

describe('KnowledgeCardComponent', () => {
  let component: KnowledgeCardComponent;
  let fixture: ComponentFixture<KnowledgeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
