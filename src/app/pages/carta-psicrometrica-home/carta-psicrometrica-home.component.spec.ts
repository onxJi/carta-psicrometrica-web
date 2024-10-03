import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaPsicrometricaHomeComponent } from './carta-psicrometrica-home.component';

describe('CartaPsicrometricaHomeComponent', () => {
  let component: CartaPsicrometricaHomeComponent;
  let fixture: ComponentFixture<CartaPsicrometricaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaPsicrometricaHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartaPsicrometricaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
