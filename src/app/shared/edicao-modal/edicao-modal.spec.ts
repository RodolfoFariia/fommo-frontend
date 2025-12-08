import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoModal } from './edicao-modal';

describe('EdicaoModal', () => {
  let component: EdicaoModal;
  let fixture: ComponentFixture<EdicaoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicaoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
