export interface Venta {
  uuid: string;
  fecha_creacion: string;
  folio: string;
  cliente_nombre: string;
  cliente_apellido?: string;
  cliente_id: number;
  empleado_id: number;
  productos: any; // JSON string
  metodos_pago: any; // JSON string
  total: number;
  estado: number;
 }