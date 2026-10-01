import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaLibro } from '../models/categoria.model';

/**
 * Servicio Angular que consume la API REST de CategoriaLibro (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoriaLibroService {

  private apiUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) { }

  listar(): Observable<CategoriaLibro[]> {
    return this.http.get<CategoriaLibro[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<CategoriaLibro> {
    return this.http.get<CategoriaLibro>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: CategoriaLibro): Observable<CategoriaLibro> {
    return this.http.post<CategoriaLibro>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: CategoriaLibro): Observable<CategoriaLibro> {
    return this.http.put<CategoriaLibro>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
