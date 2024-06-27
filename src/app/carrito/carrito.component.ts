import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito.service';
import { AuthService } from '../services/auth.service';
import { ProductoEnCarrito } from '../model/producto-en-carrito';
import { Producto } from '../model/producto';
import { ProductoService } from '../services/producto.service';
import { FormsModule } from '@angular/forms';
import { Orden } from '../model/orden';
import { OrdenService } from '../services/orden.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
})
export class CarritoComponent implements OnInit {

  productos: ProductoEnCarrito[] = [];
  prods: Producto[] = [];
  email: string = '';
  total: number = 0;
  arrayprod : { id: number, cantidad: number }[] = [];
  isDateValid: boolean = true;

  // Variables para el modal de confirmación
  showModal: boolean = false;
  indexToDelete: number | null = null;

  // Variables para el modal de confirmación de compra
  showPurchaseModal: boolean = false;
  purchaseDate: string = '';

  // Variables para los modales de éxito y error
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private productoService: ProductoService,
    private ordenService: OrdenService,
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail()!;
    this.loadCarrito();
  }

  loadCarrito() {
    this.carritoService.get(this.email).subscribe((productos) => {
      this.productos = productos;
      this.total = 0;  
      const requests = productos.map(producto => 
        this.productoService.getProductoById(producto.idProd).toPromise()
      );
      Promise.all(requests).then(productosObtenidos => {
        this.prods = productosObtenidos.filter(prod => prod !== undefined) as Producto[];
        this.prods.forEach((prod, index) => {
          this.total += this.productos[index].cantidad * prod.precio;
        });
      }).catch(error => {
        console.error('Error al obtener los productos:', error);
      });
    });
  }

  openModal(index: number) {
    this.indexToDelete = index;
    this.showModal = true;
  }

  confirmDelete() {
    if (this.indexToDelete !== null) {
      this.eliminarProducto(this.indexToDelete);
      this.showModal = false;
      this.indexToDelete = null;
    }
  }

  cancelDelete() {
    this.showModal = false;
    this.indexToDelete = null;
  }

  eliminarProducto(index: number) {
    const productoEliminado = this.productos[index];
    this.carritoService.delete(this.email, productoEliminado.idProd).subscribe({
      next: () => {
        this.productos.splice(index, 1);
        this.prods.splice(index, 1);
        this.loadCarrito();
      },
      error: (error) => {
        console.error('Error al eliminar el producto del carrito:', error);
      }
    });
  }
  
  openPurchaseModal() {
    this.showPurchaseModal = true;
  }

  confirmPurchase() {
    this.validateDate();
    if (this.isDateValid) {
      if (this.purchaseDate) {
        const emailCliente = this.authService.getEmail();
        if (!emailCliente) {
          console.error('Email del cliente es null o undefined');
          return;
        }

        this.productos.forEach((p: ProductoEnCarrito) => {
          this.arrayprod.push({
            id: p.idProd,
            cantidad: p.cantidad
          });
        });

        const nuevaOrden: Orden = {
          id: 0,
          productos: this.arrayprod,
          fecha: this.purchaseDate,
          cobro: this.total,
          estado: 'Pendiente',
          cliente: emailCliente,
        };

        this.ordenService.add(nuevaOrden).subscribe({
          next: () => {
            this.carritoService.deleteAll(emailCliente).subscribe(() => {
              this.loadCarrito();
            });
            this.showPurchaseModal = false;
            this.purchaseDate = '';
            this.showSuccessModal = true; // Muestra el modal de éxito
          },
          error: (error) => {
            console.error('Error al confirmar la compra:', error);
            this.showPurchaseModal = false;
            this.showErrorModal = true; // Muestra el modal de error
          }
        });
      } else {
        this.showErrorModal = true;
      }
    }
  }

  cancelPurchase() {
    this.showPurchaseModal = false;
    this.purchaseDate = '';
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  validateDate(): void {
    if (!this.purchaseDate) {
      this.isDateValid = false;
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(this.purchaseDate);
    
    this.isDateValid = selectedDate > today;
  }

}
