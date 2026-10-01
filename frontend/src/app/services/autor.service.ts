import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor } from '../models/autor.model';

/**
 * Servicio Angular que consume la API REST de Autor (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private apiUrl = 'http://localhost:8080/api/autores';

  constructor(private http: HttpClient) { }

  listar(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Autor): Observable<Autor> {
    return this.http.post<Autor>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Autor): Observable<Autor> {
    return this.http.put<Autor>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
