export interface DetallePrestamo {
  id?: number;
  fechaDevolucion?: string;
  estado?: string;
  prestamo: { id: number };
  ejemplar: { id: number };
}
