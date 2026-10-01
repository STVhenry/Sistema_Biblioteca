import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../models/libro.model';

/**
 * Servicio Angular que consume la API REST de Libro (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private apiUrl = 'http://localhost:8080/api/libros';

  constructor(private http: HttpClient) { }

  listar(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Libro): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
