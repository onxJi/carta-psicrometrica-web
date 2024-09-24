import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpsPageComponent } from './helps-page.component';

describe('HelpsPageComponent', () => {
  let component: HelpsPageComponent;
  let fixture: ComponentFixture<HelpsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
