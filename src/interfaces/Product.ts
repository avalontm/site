// src/interfaces/Product.ts
export class Product {
  uuid: string = ""; 
  fecha_creacion: Date = new Date();
  categoria_uuid: string = "";
  inversionista_uuid: string = "";
  sku: string = "";
  nombre: string = "";
  descripcion: string = "";
  imagen: string = "";
  precio_unitario: number = 0;
  precio: number = 0;
  cantidad: number = 1;
  no_disponible: boolean = false;

  constructor(init?: Partial<Product>) {
    Object.assign(this, init);
  }
}
