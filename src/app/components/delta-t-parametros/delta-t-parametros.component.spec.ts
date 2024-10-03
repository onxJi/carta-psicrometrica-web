import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaTParametrosComponent } from './delta-t-parametros.component';

describe('DeltaTParametrosComponent', () => {
  let component: DeltaTParametrosComponent;
  let fixture: ComponentFixture<DeltaTParametrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeltaTParametrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeltaTParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
