import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosNuevoComponent } from './insumos-nuevo.component';

describe('InsumosNuevoComponent', () => {
  let component: InsumosNuevoComponent;
  let fixture: ComponentFixture<InsumosNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosNuevoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsumosNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
