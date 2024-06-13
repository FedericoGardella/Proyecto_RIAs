import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesNuevoComponent } from './ordenes-nuevo.component';

describe('OrdenesNuevoComponent', () => {
  let component: OrdenesNuevoComponent;
  let fixture: ComponentFixture<OrdenesNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesNuevoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdenesNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
