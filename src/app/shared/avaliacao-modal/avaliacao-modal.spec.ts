import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoModal } from './avaliacao-modal';

describe('AvaliacaoModal', () => {
  let component: AvaliacaoModal;
  let fixture: ComponentFixture<AvaliacaoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliacaoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaliacaoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
