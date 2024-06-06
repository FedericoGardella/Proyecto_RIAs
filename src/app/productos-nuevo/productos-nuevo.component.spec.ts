import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosNuevoComponent } from './productos-nuevo.component';

describe('ProductosNuevoComponent', () => {
  let component: ProductosNuevoComponent;
  let fixture: ComponentFixture<ProductosNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosNuevoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductosNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
