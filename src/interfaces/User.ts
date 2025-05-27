// src/interfaces/User.ts
export interface User {
  uuid: string;
  nombre: string;
  email: string;
  apellido: string;
  telefono?: string;
  avatar?: string;
  puntos: number;
  contrasena?: string;  // Agregado para manejar la contraseña
  role: number;         // 0: Usuario, 1: Administrador, 2: Super Administrador
}
