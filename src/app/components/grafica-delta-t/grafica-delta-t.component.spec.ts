import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaDeltaTComponent } from './grafica-delta-t.component';

describe('GraficaDeltaTComponent', () => {
  let component: GraficaDeltaTComponent;
  let fixture: ComponentFixture<GraficaDeltaTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficaDeltaTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficaDeltaTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
