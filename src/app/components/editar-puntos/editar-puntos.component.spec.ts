import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPuntosComponent } from './editar-puntos.component';

describe('EditarPuntosComponent', () => {
  let component: EditarPuntosComponent;
  let fixture: ComponentFixture<EditarPuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPuntosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
