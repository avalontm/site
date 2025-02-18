// src/interfaces/Product.ts
export interface Product {
  uuid: string; 
  fecha_creacion: Date;
  categoria_uuid: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio_unitario: number;
  precio: number;
  cantidad: number;
  no_disponible: boolean;
}
