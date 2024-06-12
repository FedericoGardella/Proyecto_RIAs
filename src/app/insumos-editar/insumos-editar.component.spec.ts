import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosEditarComponent } from './insumos-editar.component';

describe('InsumosEditarComponent', () => {
  let component: InsumosEditarComponent;
  let fixture: ComponentFixture<InsumosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsumosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
