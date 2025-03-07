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
}
