import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Editorial } from '../models/editorial.model';

/**
 * Servicio Angular que consume la API REST de Editorial (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  private apiUrl = 'http://localhost:8080/api/editoriales';

  constructor(private http: HttpClient) { }

  listar(): Observable<Editorial[]> {
    return this.http.get<Editorial[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Editorial> {
    return this.http.get<Editorial>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Editorial): Observable<Editorial> {
    return this.http.post<Editorial>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Editorial): Observable<Editorial> {
    return this.http.put<Editorial>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
