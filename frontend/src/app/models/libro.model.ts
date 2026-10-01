export interface Libro {
  id?: number;
  isbn: string;
  titulo: string;
  anioPublicacion?: number;
  numeroPaginas?: number;
  estado?: boolean;
  categoria: { id: number };
  editorial: { id: number };
}
