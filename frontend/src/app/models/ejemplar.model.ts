export interface Ejemplar {
  id?: number;
  codigoBarra: string;
  ubicacion?: string;
  estado?: string;
  libro: { id: number };
}
