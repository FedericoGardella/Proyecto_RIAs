export class Orden {
    public id: number = 0;
    public productos: { id: number, cantidad: number }[] = [];
    public fecha: string = '';
    public cobro: number = 0;
    public estado: string = '';
    public cliente: string = '';
  }
  
  


