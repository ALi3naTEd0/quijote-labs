export type Moneda = "MXN" | "USD" | "EUR";
export type TipoItem = "normal" | "descuento" | "adicional";
export type Estado = "Borrador" | "Emitido" | "Pago pendiente" | "Pagado" | "Cancelado";

export interface Item {
  id: string;
  concepto: string;
  nota: string;
  monto: number;
  tipo: TipoItem;
  tag: string;
}

export interface Pago {
  id: string;
  descripcion: string;
  fecha: string;
  monto: number;
}

export interface Cotizacion {
  id: string;
  folio: string;
  cliente: string;
  moneda: Moneda;
  fechaEmision: string;
  proyecto: string;
  estado: Estado;
  items: Item[];
  pagos: Pago[];
  notaFinal: string;
  createdAt: number;
  updatedAt: number;
}
