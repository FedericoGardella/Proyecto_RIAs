import { Insumo } from "./insumo";

export class Producto {
    public id: number = 0;
    public nombre: string = '';
    public descripcion: string = ''; 
    public imagen: string = '';
    public precio: number = 0;
    public insumos: { insumo: Insumo, cantidad: number }[] = [];
}
