import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaTHomeComponent } from './delta-t-home.component';

describe('DeltaTHomeComponent', () => {
  let component: DeltaTHomeComponent;
  let fixture: ComponentFixture<DeltaTHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeltaTHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeltaTHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
