export interface Multa {
  id?: number;
  monto: number;
  motivo?: string;
  fechaMulta?: string;
  pagada?: boolean;
  prestamo: { id: number };
  socio: { id: number };
}
