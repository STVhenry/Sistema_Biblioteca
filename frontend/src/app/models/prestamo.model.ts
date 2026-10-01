export interface Prestamo {
  id?: number;
  fechaPrestamo: string;
  fechaLimite: string;
  estado?: string;
  socio: { id: number };
  usuario: { id: number };
}
