export interface Venta {
  id: number;
  uuid: string;
  fecha_creacion: string;
  folio: string;
  cliente_id: number;
  empleado_id: number;
  productos: JSON;
  metodos_pago: JSON;
  total: number;
  estado: number;
}