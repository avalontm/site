// src/interfaces/Product.ts
export interface Product {
  identifier: string; 
  fecha_creacion: Date;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  cantidad: number;
  no_disponible: boolean;
}
