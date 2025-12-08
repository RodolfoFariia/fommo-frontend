import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoCard } from './avaliacao-card';

describe('AvaliacaoCard', () => {
  let component: AvaliacaoCard;
  let fixture: ComponentFixture<AvaliacaoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliacaoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaliacaoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
