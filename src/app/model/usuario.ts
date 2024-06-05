export class Usuario {
    public email: string = '';
    public password: string = '';
    public role: 'admin' | 'panadero' | 'cliente' = 'cliente';
    public telefono: string = '';
}
