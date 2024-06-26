export class Usuario {
    public id: number = 0;
    public email: string = '';
    public password: string = '';
    public role: 'ADMIN' | 'PANADERO' | 'USER' = 'USER';
    public telefono: string = '';
}
