export class Usuario {
    public email: string = '';
    public password: string = '';
    public role: 'ADMIN' | 'PANADERO' | 'USER' = 'USER';
    public telefono: string = '';
}
