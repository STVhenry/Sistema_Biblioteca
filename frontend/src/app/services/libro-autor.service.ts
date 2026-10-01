import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibroAutor } from '../models/libro-autor.model';

/**
 * Servicio Angular que consume la API REST de LibroAutor (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class LibroAutorService {

  private apiUrl = 'http://localhost:8080/api/libro-autores';

  constructor(private http: HttpClient) { }

  listar(): Observable<LibroAutor[]> {
    return this.http.get<LibroAutor[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<LibroAutor> {
    return this.http.get<LibroAutor>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: LibroAutor): Observable<LibroAutor> {
    return this.http.post<LibroAutor>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: LibroAutor): Observable<LibroAutor> {
    return this.http.put<LibroAutor>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
