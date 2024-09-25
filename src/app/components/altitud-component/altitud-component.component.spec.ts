import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltitudComponentComponent } from './altitud-component.component';

describe('AltitudComponentComponent', () => {
  let component: AltitudComponentComponent;
  let fixture: ComponentFixture<AltitudComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltitudComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltitudComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
